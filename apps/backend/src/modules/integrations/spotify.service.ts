import { prisma } from '../../shared/db';

interface SpotifyTokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    images: { url: string; height: number; width: number }[];
    popularity: number;
    external_urls: { spotify: string };
}

interface SpotifyTopArtistsResponse {
    items: SpotifyArtist[];
    total: number;
}

interface SpotifyProfile {
    id: string;
    display_name: string;
    email?: string;
    images?: { url: string; height: number; width: number }[];
}

export class SpotifyService {
    private static readonly AUTH_BASE = 'https://accounts.spotify.com';
    private static readonly API_BASE = 'https://api.spotify.com/v1';
    private static readonly SCOPES = 'user-top-read user-read-private';

    /**
     * Generate Spotify OAuth URL
     */
    static getAuthUrl(state: string): string {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3001/api/integrations/spotify/callback';

        if (!clientId) {
            throw new Error('SPOTIFY_CLIENT_ID não configurado');
        }

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: this.SCOPES,
            redirect_uri: redirectUri,
            state
        });

        const authUrl = `${this.AUTH_BASE}/authorize?${params.toString()}`;
        console.log('🔍 Spotify Auth URL:', authUrl);
        console.log('🔍 Redirect URI used:', redirectUri);
        return authUrl;
    }

    /**
     * Exchange authorization code for tokens
     */
    static async exchangeCode(code: string): Promise<SpotifyTokens> {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3001/api/integrations/spotify/callback';

        if (!clientId || !clientSecret) {
            throw new Error('Spotify credentials não configuradas');
        }

        const response = await fetch(`${this.AUTH_BASE}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Erro ao obter tokens Spotify: ${error}`);
        }

        return response.json() as Promise<SpotifyTokens>;
    }

    /**
     * Refresh access token
     */
    static async refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Spotify credentials não configuradas');
        }

        const response = await fetch(`${this.AUTH_BASE}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar token Spotify');
        }

        return response.json() as Promise<SpotifyTokens>;
    }

    /**
     * Get user's Spotify profile
     */
    static async getProfile(accessToken: string) {
        const response = await fetch(`${this.API_BASE}/me`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar perfil Spotify');
        }

        return response.json() as Promise<SpotifyProfile>;
    }

    /**
     * Get user's top artists
     */
    static async getTopArtists(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 20): Promise<SpotifyArtist[]> {
        const response = await fetch(`${this.API_BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar artistas favoritos');
        }

        const data = await response.json() as SpotifyTopArtistsResponse;
        return data.items;
    }

    /**
     * Connect Spotify account (after OAuth callback)
     */
    static async connect(userId: string, code: string) {
        // Exchange code for tokens
        const tokens = await this.exchangeCode(code);

        // Get user profile
        const profile = await this.getProfile(tokens.access_token);

        // Get top artists
        const artists = await this.getTopArtists(tokens.access_token, 'medium_term', 50);

        // Save or update integration
        const integration = await prisma.integration.upsert({
            where: {
                userId_type: {
                    userId,
                    type: 'spotify'
                }
            },
            update: {
                externalId: profile.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                data: JSON.stringify({
                    profile: {
                        id: profile.id,
                        displayName: profile.display_name,
                        email: profile.email,
                        images: profile.images
                    },
                    artists: artists.map(a => ({
                        id: a.id,
                        name: a.name,
                        genres: a.genres,
                        imageUrl: a.images[0]?.url,
                        popularity: a.popularity
                    }))
                }),
                syncedAt: new Date()
            },
            create: {
                userId,
                type: 'spotify',
                externalId: profile.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                data: JSON.stringify({
                    profile: {
                        id: profile.id,
                        displayName: profile.display_name,
                        email: profile.email,
                        images: profile.images
                    },
                    artists: artists.map(a => ({
                        id: a.id,
                        name: a.name,
                        genres: a.genres,
                        imageUrl: a.images[0]?.url,
                        popularity: a.popularity
                    }))
                }),
                syncedAt: new Date()
            }
        });

        return {
            connected: true,
            profile: {
                spotifyId: profile.id,
                displayName: profile.display_name,
                avatarUrl: profile.images?.[0]?.url
            },
            artistCount: artists.length,
            topArtists: artists.slice(0, 10).map(a => ({
                id: a.id,
                name: a.name,
                genres: a.genres.slice(0, 3),
                imageUrl: a.images[0]?.url
            }))
        };
    }

    /**
     * Get user's Spotify integration data
     */
    static async getIntegration(userId: string) {
        const integration = await prisma.integration.findUnique({
            where: {
                userId_type: {
                    userId,
                    type: 'spotify'
                }
            }
        });

        if (!integration) {
            return null;
        }

        const data = JSON.parse(integration.data);

        // Handle manual data
        if (data.manual) {
            return {
                connected: true,
                isManual: true,
                spotifyId: integration.externalId,
                profileUrl: data.profileUrl,
                playlists: data.playlists,
                genres: data.genres,
                topSongs: data.topSongs,
                syncedAt: integration.syncedAt
            };
        }

        return {
            connected: true,
            spotifyId: integration.externalId,
            profile: data.profile,
            artistCount: data.artists?.length || 0,
            topArtists: data.artists?.slice(0, 10) || [],
            syncedAt: integration.syncedAt
        };
    }

    /**
     * Disconnect Spotify integration
     */
    static async disconnect(userId: string) {
        await prisma.integration.delete({
            where: {
                userId_type: {
                    userId,
                    type: 'spotify'
                }
            }
        });

        return { disconnected: true };
    }

    /**
     * Sync Spotify data (refresh)
     */
    static async sync(userId: string) {
        const integration = await prisma.integration.findUnique({
            where: {
                userId_type: {
                    userId,
                    type: 'spotify'
                }
            }
        });

        if (!integration || !integration.refreshToken) {
            throw new Error('Spotify não conectado');
        }

        // Refresh token
        const tokens = await this.refreshAccessToken(integration.refreshToken);

        // Get updated data
        const profile = await this.getProfile(tokens.access_token);
        const artists = await this.getTopArtists(tokens.access_token, 'medium_term', 50);

        // Update integration
        await prisma.integration.update({
            where: {
                userId_type: {
                    userId,
                    type: 'spotify'
                }
            },
            data: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || integration.refreshToken,
                data: JSON.stringify({
                    profile: {
                        id: profile.id,
                        displayName: profile.display_name,
                        email: profile.email,
                        images: profile.images
                    },
                    artists: artists.map(a => ({
                        id: a.id,
                        name: a.name,
                        genres: a.genres,
                        imageUrl: a.images[0]?.url,
                        popularity: a.popularity
                    }))
                }),
                syncedAt: new Date()
            }
        });

        return {
            synced: true,
            profile: {
                spotifyId: profile.id,
                displayName: profile.display_name,
                avatarUrl: profile.images?.[0]?.url
            },
            artistCount: artists.length,
            topArtists: artists.slice(0, 10).map(a => ({
                id: a.id,
                name: a.name,
                genres: a.genres.slice(0, 3),
                imageUrl: a.images[0]?.url
            }))
        };
    }
    private static clientToken: string | null = null;
    private static clientTokenExpiresAt: number = 0;

    /**
     * Get Client Credentials Token (App-level auth)
     */
    static async getClientToken(): Promise<string> {
        if (this.clientToken && Date.now() < this.clientTokenExpiresAt) {
            return this.clientToken;
        }

        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Spotify credentials não configuradas');
        }

        const response = await fetch(`${this.AUTH_BASE}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao obter token de aplicativo do Spotify');
        }

        const data = await response.json() as any;
        this.clientToken = data.access_token;
        this.clientTokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // 1 min buffer

        return this.clientToken as string;
    }

    /**
     * Search tracks
     */
    static async searchTracks(query: string, limit: number = 20) {
        const token = await this.getClientToken();
        const response = await fetch(`${this.API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[SpotifyService] searchTracks Error: ${response.status} ${response.statusText}`, errorText);
            throw new Error('Erro ao buscar músicas');
        }

        const data = await response.json() as any;
        return data.tracks.items.map((t: any) => ({
            id: t.id,
            name: t.name,
            artist: t.artists[0].name,
            album: t.album.name,
            imageUrl: t.album.images[0]?.url,
            url: t.external_urls.spotify,
            previewUrl: t.preview_url
        }));
    }

    /**
     * Get available genres
     */
    static async getGenres() {
        try {
            const token = await this.getClientToken();
            const response = await fetch(`${this.API_BASE}/recommendations/available-genre-seeds`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[SpotifyService] getGenres API Error: ${response.status}`, errorText);
                // Fallback to static list on error
                return [
                    "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime",
                    "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat",
                    "british", "cantopop", "chicago-house", "children", "chill", "classical",
                    "club", "comedy", "country", "dance", "dancehall", "death-metal",
                    "deep-house", "disco", "disney", "drum-and-bass", "dub", "dubstep",
                    "edm", "electro", "electronic", "emo", "folk", "forro", "french",
                    "funk", "garage", "german", "gospel", "goth", "grindcore", "groove",
                    "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle",
                    "heavy-metal", "hip-hop", "holidays", "house", "idm", "indian",
                    "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol",
                    "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino",
                    "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno",
                    "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party",
                    "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop",
                    "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day",
                    "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly",
                    "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes",
                    "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks",
                    "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno",
                    "trance", "trip-hop", "turkish", "work-out", "world-music"
                ];
            }

            const data = await response.json() as any;
            return data.genres;
        } catch (error) {
            console.error('[SpotifyService] getGenres Exception (Using Fallback):', error);
            // Fallback on exception
            return ["pop", "rock", "hip-hop", "indie", "jazz", "metal", "electronic", "classical", "r-n-b", "country", "latin", "reggae", "blues", "folk", "soul", "punk", "dance", "rap", "k-pop", "sertanejo", "funk", "pagode", "samba", "mpb"];
        }
    }
}
