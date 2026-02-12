import { Router, Response } from 'express';
import { prisma } from '../../shared/db';
import { authMiddleware, AuthRequest } from '../../shared/middleware/auth.middleware';
import { z } from 'zod';

export const matchesRouter = Router();

// Validation schemas
const swipeSchema = z.object({
    targetUserId: z.string(),
    action: z.enum(['like', 'pass', 'superlike'])
});

/**
 * GET /api/matches/recommendations
 * Get profiles for swiping
 */
matchesRouter.get('/recommendations', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        // Get IDs of users already interacted with
        const [likes, dislikes, blocks] = await Promise.all([
            prisma.like.findMany({ where: { fromUserId: userId }, select: { toUserId: true } }),
            prisma.dislike.findMany({ where: { fromUserId: userId }, select: { toUserId: true } }),
            prisma.block.findMany({
                where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
                select: { blockerId: true, blockedId: true }
            })
        ]);

        const excludedIds = new Set([
            userId,
            ...likes.map(l => l.toUserId),
            ...dislikes.map(l => l.toUserId),
            ...blocks.map(b => b.blockerId === userId ? b.blockedId : b.blockerId)
        ]);

        console.log(`[Matches] Excluded IDs count: ${excludedIds.size}`, Array.from(excludedIds));

        // Fetch potential matches
        // In a real app, uses complex algorithms. Here: random users not in excluded list.
        const candidates = await prisma.user.findMany({
            where: {
                id: { notIn: Array.from(excludedIds) }
            },
            take: 20,
            select: {
                id: true,
                name: true,
                profile: {
                    select: {
                        bio: true,
                        birthDate: true,
                        location: true,
                        photos: true,
                        favoriteGame: true,
                        favoriteMovie: true,
                        favoriteMusic: true,
                    }
                },
                favorites: {
                    select: {
                        category: true,
                        itemName: true,
                        itemImageUrl: true,
                        position: true
                    }
                },
                integrations: {
                    select: {
                        type: true,
                        data: true
                    }
                }
            }
        });

        // Format data for frontend
        const recommendations = candidates.map(user => {
            const photos = user.profile?.photos ? JSON.parse(user.profile.photos) : [];
            const age = user.profile?.birthDate
                ? new Date().getFullYear() - new Date(user.profile.birthDate).getFullYear()
                : null;

            // Get top items
            const topGame = user.favorites.find(f => f.category === 'games' && f.position === 1);
            const topSong = user.favorites.find(f => f.category === 'music' && f.position === 1); // logic might need adjustment if using integration data

            return {
                id: user.id,
                name: user.name,
                age,
                bio: user.profile?.bio,
                location: user.profile?.location,
                photos,
                favoriteGame: user.profile?.favoriteGame,
                favoriteMovie: user.profile?.favoriteMovie,
                favoriteMusic: user.profile?.favoriteMusic,
                // Top items from favorites table (fallback or additional)
                topGame: topGame ? { name: topGame.itemName, image: topGame.itemImageUrl } : null,
                topSong: topSong ? { name: topSong.itemName, image: topSong.itemImageUrl } : null,
            };
        });

        res.json({ success: true, data: recommendations });

    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar recomendações' });
    }
});

/**
 * POST /api/matches/swipe
 * Handle like/pass
 */
matchesRouter.post('/swipe', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { targetUserId, action } = swipeSchema.parse(req.body);

        if (userId === targetUserId) {
            return res.status(400).json({ success: false, error: 'Não pode dar swipe em si mesmo' });
        }

        let isMatch = false;

        if (action === 'pass') {
            await prisma.dislike.create({
                data: { fromUserId: userId, toUserId: targetUserId }
            });
        } else {
            // Like or Superlike
            await prisma.like.create({
                data: {
                    fromUserId: userId,
                    toUserId: targetUserId,
                    isSuperLike: action === 'superlike'
                }
            });

            // Check for match
            const mutualLike = await prisma.like.findUnique({
                where: {
                    fromUserId_toUserId: {
                        fromUserId: targetUserId,
                        toUserId: userId
                    }
                }
            });

            if (mutualLike) {
                isMatch = true;
                await prisma.match.create({
                    data: {
                        user1Id: userId < targetUserId ? userId : targetUserId,
                        user2Id: userId < targetUserId ? targetUserId : userId,
                    }
                });
            }
        }

        res.json({ success: true, data: { match: isMatch } });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: error.errors });
        }
        // Handle unique constraint violations (already liked/disliked)
        if ((error as any).code === 'P2002') {
            return res.json({ success: true, data: { match: false, message: 'Já processado' } });
        }
        console.error('Swipe Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao processar swipe' });
    }
});
