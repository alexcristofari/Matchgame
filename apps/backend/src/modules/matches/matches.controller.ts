import { Router, Response } from 'express';
import { prisma } from '../../shared/db';
import { authMiddleware, AuthRequest } from '../../shared/middleware/auth.middleware';
import { z } from 'zod';
import { encryption } from '../../shared/utils/encryption';

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

/**
 * GET /api/matches/:id/messages
 * Get chat history for a match
 */
matchesRouter.get('/:id/messages', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const matchId = req.params.id;
        const cursor = req.query.cursor as string | undefined;

        // 1. Verify membership
        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { user1Id: true, user2Id: true }
        });

        if (!match) {
            return res.status(404).json({ success: false, error: 'Match not found' });
        }

        if (match.user1Id !== userId && match.user2Id !== userId) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        // 2. Fetch messages (paginated)
        const limit = 50;
        const messages = await prisma.message.findMany({
            where: { matchId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' }, // Latest first
        });

        // 3. Decrypt and format
        const decryptedMessages = messages.map(msg => ({
            id: msg.id,
            matchId: msg.matchId,
            senderId: msg.senderId,
            content: encryption.decrypt(msg.content),
            readAt: msg.readAt,
            createdAt: msg.createdAt
        })).reverse(); // Return oldest to newest for UI

        const nextCursor = messages.length === limit ? messages[messages.length - 1].id : undefined;

        res.json({
            success: true,
            data: decryptedMessages,
            pagination: { nextCursor }
        });

    } catch (error) {
        console.error('Messages Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar mensagens' });
    }
});

/**
 * GET /api/matches/:id
 * Get details of a single match (header info)
 */
matchesRouter.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;
        const matchId = req.params.id;

        const match = await prisma.match.findUnique({
            where: { id: matchId },
            include: {
                user1: { select: { id: true, name: true, profile: { select: { photos: true } } } },
                user2: { select: { id: true, name: true, profile: { select: { photos: true } } } }
            }
        });

        if (!match) {
            return res.status(404).json({ success: false, error: 'Match not found' });
        }

        if (match.user1Id !== userId && match.user2Id !== userId) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const partner = match.user1Id === userId ? match.user2 : match.user1;
        const photos = partner.profile?.photos ? JSON.parse(partner.profile.photos) : [];

        res.json({
            success: true,
            data: {
                id: match.id,
                partner: {
                    id: partner.id,
                    name: partner.name,
                    image: photos[0] || null
                }
            }
        });

    } catch (error) {
        console.error('Match Details Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar detalhes do match' });
    }
});

/**
 * GET /api/matches
 * List all matches for the current user
 */
matchesRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const matches = await prisma.match.findMany({
            where: {
                OR: [{ user1Id: userId }, { user2Id: userId }]
            },
            include: {
                user1: {
                    select: { id: true, name: true, profile: { select: { photos: true } } }
                },
                user2: {
                    select: { id: true, name: true, profile: { select: { photos: true } } }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedMatches = matches.map(match => {
            const partner = match.user1Id === userId ? match.user2 : match.user1;
            const lastMessage = match.messages[0];
            const photos = partner.profile?.photos ? JSON.parse(partner.profile.photos) : [];

            return {
                id: match.id,
                partner: {
                    id: partner.id,
                    name: partner.name,
                    image: photos[0] || null
                },
                lastMessage: lastMessage ? {
                    content: encryption.decrypt(lastMessage.content),
                    createdAt: lastMessage.createdAt,
                    limit: 50 // Preview limit
                } : null,
                createdAt: match.createdAt
            };
        });

        res.json({ success: true, data: formattedMatches });

    } catch (error) {
        console.error('List Matches Error:', error);
        res.status(500).json({ success: false, error: 'Erro ao listar matches' });
    }
});
