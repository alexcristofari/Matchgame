import { prisma } from '../../shared/db';

interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url?: string;
    img_logo_url?: string;
}

interface SteamGamesResponse {
    response: {
        game_count: number;
        games: SteamGame[];
    };
}

export class SteamService {
    private static readonly API_BASE = 'https://api.steampowered.com';

    /**
     * Get owned games from Steam API
     */
    static async getOwnedGames(steamId: string): Promise<SteamGame[]> {
        const apiKey = process.env.STEAM_API_KEY;
        if (!apiKey) {
            throw new Error('STEAM_API_KEY não configurada');
        }

        const url = `${this.API_BASE}/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar jogos da Steam');
        }

        const data = await response.json() as SteamGamesResponse;

        if (!data.response?.games) {
            throw new Error('Perfil Steam privado ou sem jogos');
        }

        return data.response.games;
    }

    /**
     * Get Steam player summary (profile info)
     */
    static async getPlayerSummary(steamId: string) {
        const apiKey = process.env.STEAM_API_KEY;
        if (!apiKey) {
            throw new Error('STEAM_API_KEY não configurada');
        }

        const url = `${this.API_BASE}/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar perfil Steam');
        }

        const data = await response.json();
        return (data as any).response?.players?.[0] || null;
    }

    /**
     * Save Steam integration to database
     */
    static async connect(userId: string, steamId: string) {
        // Verify Steam ID is valid
        const player = await this.getPlayerSummary(steamId);
        if (!player) {
            throw new Error('Steam ID inválido ou perfil não encontrado');
        }

        // Get games
        const games = await this.getOwnedGames(steamId);

        // Save or update integration
        const integration = await prisma.integration.upsert({
            where: {
                userId_type: {
                    userId,
                    type: 'steam'
                }
            },
            update: {
                externalId: steamId,
                data: JSON.stringify({
                    profile: player,
                    games: games.slice(0, 100), // Top 100 games
                    gameCount: games.length
                }),
                syncedAt: new Date()
            },
            create: {
                userId,
                type: 'steam',
                externalId: steamId,
                data: JSON.stringify({
                    profile: player,
                    games: games.slice(0, 100),
                    gameCount: games.length
                }),
                syncedAt: new Date()
            }
        });

        return {
            connected: true,
            profile: {
                steamId: player.steamid,
                personaname: player.personaname,
                avatarUrl: player.avatarfull
            },
            gameCount: games.length,
            topGames: games
                .sort((a, b) => b.playtime_forever - a.playtime_forever)
                .slice(0, 10)
                .map(g => ({
                    appid: g.appid,
                    name: g.name,
                    playtimeHours: Math.round(g.playtime_forever / 60)
                }))
        };
    }

    /**
     * Get user's Steam integration data
     */
    static async getIntegration(userId: string) {
        const integration = await prisma.integration.findUnique({
            where: {
                userId_type: {
                    userId,
                    type: 'steam'
                }
            }
        });

        if (!integration) {
            return null;
        }

        const data = JSON.parse(integration.data);
        return {
            connected: true,
            steamId: integration.externalId,
            profile: data.profile,
            gameCount: data.gameCount,
            games: (data.games || []).map((g: SteamGame) => ({
                appid: g.appid,
                name: g.name,
                playtimeHours: Math.round(g.playtime_forever / 60),
                img_icon_url: g.img_icon_url,
                img_logo_url: g.img_logo_url
            })),
            genres: data.genres || [],
            favoriteGames: data.favoriteGames || [],
            platformLinks: data.platformLinks || {},
            manual: data.manual || false,
            syncedAt: integration.syncedAt
        };
    }

    /**
     * Disconnect Steam integration
     */
    static async disconnect(userId: string) {
        await prisma.integration.delete({
            where: {
                userId_type: {
                    userId,
                    type: 'steam'
                }
            }
        });

        return { disconnected: true };
    }

    /**
     * Sync Steam games (refresh data)
     */
    static async sync(userId: string) {
        const integration = await prisma.integration.findUnique({
            where: {
                userId_type: {
                    userId,
                    type: 'steam'
                }
            }
        });

        if (!integration) {
            throw new Error('Steam não conectado');
        }

        return this.connect(userId, integration.externalId);
    }
    /**
     * Search games in Steam Store (public API)
     */
    static async searchStore(query: string) {
        // Steam Store Search API
        // https://store.steampowered.com/api/storesearch/?term={query}&l=english&cc=US
        const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=portuguese&cc=BR`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                return [];
            }

            const data = await response.json() as any;
            if (!data.items) return [];

            return data.items.map((item: any) => ({
                appid: item.id,
                name: item.name,
                // Construct high-res image URL
                img_icon_url: `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.id}/header.jpg`,
                price: item.price
            }));
        } catch (error) {
            console.error('Steam store search error:', error);
            return [];
        }
    }
}
