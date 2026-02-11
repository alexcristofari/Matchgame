import { Router, Request, Response } from 'express';
import { SteamService } from './steam.service';
import { SpotifyService } from './spotify.service';
import { AnimeService } from './anime.service';
import { MovieService } from './movie.service';
import { steamConnectSchema } from './integrations.schema';
import { AuthService } from '../auth/auth.service';
import { ZodError } from 'zod';
import { prisma } from '../../shared/db';

export const integrationsRouter = Router();

// Middleware to extract userId from token
const authenticate = (req: Request, res: Response, next: Function) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Token não fornecido' });
        }

        const token = authHeader.split(' ')[1];
        const payload = AuthService.verifyAccessToken(token);
        (req as any).userId = payload.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
};

// ==================== STATUS ====================

// GET /api/integrations/status - Get all integrations status
integrationsRouter.get('/status', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const integrations = await prisma.integration.findMany({
            where: { userId },
            select: {
                type: true,
                externalId: true,
                syncedAt: true
            }
        });

        const status: Record<string, any> = {
            steam: { connected: false },
            spotify: { connected: false }
        };

        for (const integration of integrations) {
            status[integration.type] = {
                connected: true,
                externalId: integration.externalId,
                syncedAt: integration.syncedAt
            };
        }

        res.json({ success: true, data: status });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar status';
        res.status(500).json({ success: false, error: message });
    }
});

// ==================== STEAM ====================

// POST /api/integrations/steam/connect - Connect Steam account
integrationsRouter.post('/steam/connect', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { steamId } = steamConnectSchema.parse(req.body);

        const result = await SteamService.connect(userId, steamId);

        res.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }

        const message = error instanceof Error ? error.message : 'Erro ao conectar Steam';
        res.status(400).json({ success: false, error: message });
    }
});

// GET /api/integrations/steam - Get Steam integration data
integrationsRouter.get('/steam', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const data = await SteamService.getIntegration(userId);

        if (!data) {
            return res.json({ success: true, data: { connected: false } });
        }

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar dados Steam';
        res.status(500).json({ success: false, error: message });
    }
});

// POST /api/integrations/steam/sync - Refresh Steam data
integrationsRouter.post('/steam/sync', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const result = await SteamService.sync(userId);

        res.json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao sincronizar Steam';
        res.status(400).json({ success: false, error: message });
    }
});

// DELETE /api/integrations/steam - Disconnect Steam
integrationsRouter.delete('/steam', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const result = await SteamService.disconnect(userId);

        res.json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao desconectar Steam';
        res.status(500).json({ success: false, error: message });
    }
});

// GET /api/integrations/steam/games - Get all Steam games for selection
integrationsRouter.get('/steam/games', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const integration = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'steam' } }
        });

        if (!integration) {
            return res.status(404).json({ success: false, error: 'Steam não conectado' });
        }

        const data = JSON.parse(integration.data);
        const games = (data.games || [])
            .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
            .map((g: any) => ({
                appid: g.appid,
                name: g.name,
                playtimeHours: Math.round(g.playtime_forever / 60),
                iconUrl: g.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg` : null
            }));

        const favorites = data.favoriteGames || [];

        res.json({ success: true, data: { games, favorites } });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar jogos';
        res.status(500).json({ success: false, error: message });
    }
});

// PUT /api/integrations/steam/favorites - Save favorite games (max 5)
integrationsRouter.put('/steam/favorites', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { favorites } = req.body; // Array of appids

        if (!Array.isArray(favorites) || favorites.length > 5) {
            return res.status(400).json({ success: false, error: 'Selecione até 5 jogos favoritos' });
        }

        const integration = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'steam' } }
        });

        if (!integration) {
            return res.status(404).json({ success: false, error: 'Steam não conectado' });
        }

        const data = JSON.parse(integration.data);

        // Find the full game data for favorites
        const favoriteGames = favorites.map((appid: number) => {
            const game = data.games.find((g: any) => g.appid === appid);
            return game ? {
                appid: game.appid,
                name: game.name,
                playtimeHours: Math.round(game.playtime_forever / 60)
            } : null;
        }).filter(Boolean);

        data.favoriteGames = favoriteGames;

        await prisma.integration.update({
            where: { userId_type: { userId, type: 'steam' } },
            data: { data: JSON.stringify(data) }
        });

        res.json({ success: true, data: { favorites: favoriteGames } });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar favoritos';
        res.status(500).json({ success: false, error: message });
    }
});

// ==================== SPOTIFY ====================

// GET /api/integrations/spotify/auth - Get Spotify OAuth URL
integrationsRouter.get('/spotify/auth', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        // Use userId as state to verify on callback
        const authUrl = SpotifyService.getAuthUrl(userId);

        res.json({ success: true, data: { authUrl } });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao gerar URL de autenticação';
        res.status(500).json({ success: false, error: message });
    }
});

// GET /api/integrations/spotify/callback - Spotify OAuth callback
integrationsRouter.get('/spotify/callback', async (req: Request, res: Response) => {
    try {
        const { code, state, error: spotifyError } = req.query;

        if (spotifyError) {
            // Redirect to frontend with error
            return res.redirect(`http://localhost:3000/dashboard?spotify_error=${spotifyError}`);
        }

        if (!code || !state) {
            return res.redirect('http://localhost:3000/dashboard?spotify_error=missing_params');
        }

        const userId = state as string;
        await SpotifyService.connect(userId, code as string);

        // Redirect to frontend with success
        res.redirect('http://localhost:3000/dashboard?spotify_connected=true');
    } catch (error) {
        console.error('Spotify callback error:', error);
        res.redirect('http://localhost:3000/dashboard?spotify_error=connection_failed');
    }
});

// POST /api/integrations/spotify/complete - Complete Spotify OAuth (called from HTML callback page)
integrationsRouter.post('/spotify/complete', async (req: Request, res: Response) => {
    try {
        const { code, state } = req.body;

        if (!code || !state) {
            return res.status(400).json({ success: false, error: 'Missing code or state' });
        }

        const userId = state as string;
        const result = await SpotifyService.connect(userId, code);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Spotify complete error:', error);
        const message = error instanceof Error ? error.message : 'Erro ao conectar Spotify';
        res.status(400).json({ success: false, error: message });
    }
});

// GET /api/integrations/spotify - Get Spotify integration data
integrationsRouter.get('/spotify', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const data = await SpotifyService.getIntegration(userId);

        if (!data) {
            return res.json({ success: true, data: { connected: false } });
        }

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar dados Spotify';
        res.status(500).json({ success: false, error: message });
    }
});

// POST /api/integrations/spotify/sync - Refresh Spotify data
integrationsRouter.post('/spotify/sync', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const result = await SpotifyService.sync(userId);

        res.json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao sincronizar Spotify';
        res.status(400).json({ success: false, error: message });
    }
});

// DELETE /api/integrations/spotify - Disconnect Spotify
integrationsRouter.delete('/spotify', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const result = await SpotifyService.disconnect(userId);

        res.json({ success: true, data: result });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao desconectar Spotify';
        res.status(500).json({ success: false, error: message });
    }
});
// GET /api/integrations/spotify/search - Search tracks (public)
integrationsRouter.get('/spotify/search', authenticate, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ success: false, error: 'Query obrigatória' });
        }

        const tracks = await SpotifyService.searchTracks(q);
        res.json({ success: true, data: tracks });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar músicas';
        res.status(500).json({ success: false, error: message });
    }
});

// GET /api/integrations/spotify/genres - Get available genres
integrationsRouter.get('/spotify/genres', authenticate, async (req: Request, res: Response) => {
    try {
        const genres = await SpotifyService.getGenres();
        res.json({ success: true, data: genres });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar gêneros';
        res.status(500).json({ success: false, error: message });
    }
});

// PUT /api/integrations/spotify/manual - Save manual Spotify data
integrationsRouter.put('/spotify/manual', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { profileUrl, playlists, genres, topSongs } = req.body;

        // Basic validation
        if (playlists && (!Array.isArray(playlists) || playlists.length > 3)) {
            return res.status(400).json({ success: false, error: 'Máximo de 3 playlists' });
        }
        if (genres && (!Array.isArray(genres) || genres.length > 3)) {
            return res.status(400).json({ success: false, error: 'Máximo de 3 gêneros' });
        }
        if (topSongs && (!Array.isArray(topSongs) || topSongs.length > 5)) {
            return res.status(400).json({ success: false, error: 'Máximo de 5 músicas favoritas' });
        }

        // Upsert integration
        const existing = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'spotify' } }
        });

        let data = existing ? JSON.parse(existing.data) : {};

        // Merge manual data
        data = {
            ...data,
            manual: true,
            profileUrl,
            playlists: playlists || [],
            genres: genres || [],
            topSongs: topSongs || [], // { name, artist, url }
            updatedAt: new Date().toISOString()
        };

        await prisma.integration.upsert({
            where: { userId_type: { userId, type: 'spotify' } },
            update: {
                data: JSON.stringify(data),
                syncedAt: new Date()
            },
            create: {
                userId,
                type: 'spotify',
                externalId: `manual_${userId}`,
                data: JSON.stringify(data),
                syncedAt: new Date()
            }
        });

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar dados do Spotify';
        res.status(500).json({ success: false, error: message });
    }
});

// ==========================================
// ANIME INTEGRATION (Jikan/Manual)
// ==========================================

// GET /api/integrations/anime - Get user anime integration
integrationsRouter.get('/anime', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const integration = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'anime' } }
        });

        if (!integration) {
            return res.json({ success: true, data: { connected: false } });
        }

        const data = JSON.parse(integration.data);
        res.json({ success: true, data: { ...data, connected: true } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar dados de anime' });
    }
});

// GET /api/integrations/anime/search
integrationsRouter.get('/anime/search', authenticate, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ success: false, error: 'Query obrigatória' });
        }

        const animes = await AnimeService.searchAnime(q);
        res.json({ success: true, data: animes });
    } catch (error) {
        console.error('Anime Search Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar animes' });
    }
});

// GET /api/integrations/anime/genres
integrationsRouter.get('/anime/genres', authenticate, async (req: Request, res: Response) => {
    try {
        const genres = await AnimeService.getGenres();
        res.json({ success: true, data: genres });
    } catch (error) {
        console.error('Anime Genres Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar gêneros de anime' });
    }
});

// PUT /api/integrations/anime/manual
integrationsRouter.put('/anime/manual', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { genres, favorites, profileUrl } = req.body;

        // Validation
        if (genres && (!Array.isArray(genres) || genres.length > 3)) {
            return res.status(400).json({ success: false, error: 'Máximo de 3 gêneros' });
        }
        if (favorites && (!Array.isArray(favorites) || favorites.length > 5)) {
            return res.status(400).json({ success: false, error: 'Máximo de 5 animes favoritos' });
        }

        // Check for existing integration
        const existing = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'anime' } }
        });

        let data = existing ? JSON.parse(existing.data) : {};

        data = {
            ...data,
            manual: true,
            genres: genres || [],
            favorites: favorites || [], // { id, title, imageUrl }
            profileUrl,
            updatedAt: new Date().toISOString()
        };

        await prisma.integration.upsert({
            where: { userId_type: { userId, type: 'anime' } },
            update: {
                data: JSON.stringify(data),
                syncedAt: new Date()
            },
            create: {
                userId,
                type: 'anime',
                externalId: `manual_anime_${userId}`,
                data: JSON.stringify(data),
                syncedAt: new Date()
            }
        });

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar animes';
        res.status(500).json({ success: false, error: message });
    }
});

// ==========================================
// MOVIE INTEGRATION (TMDB/Manual)
// ==========================================

// GET /api/integrations/movie - Get user movie integration
integrationsRouter.get('/movie', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const integration = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'movie' } }
        });

        if (!integration) {
            return res.json({ success: true, data: { connected: false } });
        }

        const data = JSON.parse(integration.data);
        res.json({ success: true, data: { ...data, connected: true } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar dados de filmes' });
    }
});

// GET /api/integrations/movie/search
integrationsRouter.get('/movie/search', authenticate, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ success: false, error: 'Query obrigatória' });
        }

        const movies = await MovieService.searchMovies(q);
        res.json({ success: true, data: movies });
    } catch (error) {
        console.error('Movie Search Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar filmes' });
    }
});

// GET /api/integrations/movie/genres
integrationsRouter.get('/movie/genres', authenticate, async (req: Request, res: Response) => {
    try {
        const genres = await MovieService.getGenres();
        res.json({ success: true, data: genres });
    } catch (error) {
        console.error('Movie Genres Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar gêneros de filmes' });
    }
});

// PUT /api/integrations/movie/manual
integrationsRouter.put('/movie/manual', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { genres, favorites, profileUrl } = req.body;

        // Validation
        if (genres && (!Array.isArray(genres) || genres.length > 3)) {
            return res.status(400).json({ success: false, error: 'Máximo de 3 gêneros' });
        }
        if (favorites && (!Array.isArray(favorites) || favorites.length > 5)) {
            return res.status(400).json({ success: false, error: 'Máximo de 5 filmes favoritos' });
        }

        // Check for existing integration
        const existing = await prisma.integration.findUnique({
            where: { userId_type: { userId, type: 'movie' } }
        });

        let data = existing ? JSON.parse(existing.data) : {};

        data = {
            ...data,
            manual: true,
            genres: genres || [],
            favorites: favorites || [], // { id, title, imageUrl }
            profileUrl,
            updatedAt: new Date().toISOString()
        };

        await prisma.integration.upsert({
            where: { userId_type: { userId, type: 'movie' } },
            update: {
                data: JSON.stringify(data),
                syncedAt: new Date()
            },
            create: {
                userId,
                type: 'movie',
                externalId: `manual_movie_${userId}`,
                data: JSON.stringify(data),
                syncedAt: new Date()
            }
        });

        res.json({ success: true, data });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar filmes';
        res.status(500).json({ success: false, error: message });
    }
});


