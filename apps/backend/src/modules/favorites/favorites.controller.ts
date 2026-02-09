import { Router, Request, Response } from 'express';
import { prisma } from '../../shared/db';
import { SteamService } from '../integrations/steam.service';
import { AuthService } from '../auth/auth.service';

export const favoritesRouter = Router();

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

// GET /api/favorites/games/search - Search games in Steam Store global catalog
favoritesRouter.get('/games/search', authenticate, async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query || query.length < 2) {
            return res.json({ success: true, data: [] });
        }

        const games = await SteamService.searchStore(query);

        // Map to frontend format
        const formattedGames = games.map((game: any) => ({
            appid: game.appid,
            name: game.name,
            playtimeHours: 0, // No playtime for search results
            iconUrl: game.img_icon_url
        }));

        res.json({ success: true, data: formattedGames });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar jogos';
        res.status(500).json({ success: false, error: message });
    }
});

// GET /api/favorites/games - Get user favorite games
favoritesRouter.get('/games', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const favorites = await prisma.favorite.findMany({
            where: {
                userId,
                category: 'games'
            },
            orderBy: {
                position: 'asc'
            }
        });

        // Map to frontend format
        const formattedFavorites = favorites.map(f => ({
            appid: parseInt(f.itemId),
            name: f.itemName,
            iconUrl: f.itemImageUrl,
            playtimeHours: 0 // Optional
        }));

        res.json({ success: true, data: formattedFavorites });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao buscar favoritos';
        res.status(500).json({ success: false, error: message });
    }
});

// PUT /api/favorites/games - Save favorite games
favoritesRouter.put('/games', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { favorites } = req.body; // Array of { appid, name, iconUrl }

        if (!Array.isArray(favorites) || favorites.length > 5) {
            return res.status(400).json({ success: false, error: 'Selecione até 5 jogos favoritos' });
        }

        // Transaction to replace favorites
        await prisma.$transaction(async (tx) => {
            // Delete existing game favorites
            await tx.favorite.deleteMany({
                where: {
                    userId,
                    category: 'games'
                }
            });

            // Create new favorites
            if (favorites.length > 0) {
                await tx.favorite.createMany({
                    data: favorites.map((f: any, index: number) => ({
                        userId,
                        category: 'games',
                        position: index + 1,
                        itemId: f.appid.toString(),
                        itemName: f.name,
                        itemImageUrl: f.iconUrl
                    }))
                });
            }
        });

        res.json({ success: true, data: favorites });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao salvar favoritos';
        res.status(500).json({ success: false, error: message });
    }
});
