import { Router, Response } from 'express';
import { prisma } from '../../shared/db';
import { authMiddleware, AuthRequest } from '../../shared/middleware/auth.middleware';

export const usersRouter = Router();

// GET /api/users/me - Get current user details
usersRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                profile: {
                    select: {
                        bio: true,
                        birthDate: true,
                        location: true,
                        lookingFor: true,
                        photos: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        // Parse photos JSON
        const userData = {
            ...user,
            profile: user.profile ? {
                ...user.profile,
                photos: JSON.parse(user.profile.photos || '[]')
            } : null
        };

        res.json({
            success: true,
            data: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar usuário'
        });
    }
});

// PATCH /api/users/me - Update current user
usersRouter.patch('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        const user = await prisma.user.update({
            where: { id: req.user!.userId },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true
            }
        });

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar usuário'
        });
    }
});

// DELETE /api/users/me - Delete account
usersRouter.delete('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.user.delete({
            where: { id: req.user!.userId }
        });

        res.json({
            success: true,
            data: { message: 'Conta deletada com sucesso' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao deletar conta'
        });
    }
});
