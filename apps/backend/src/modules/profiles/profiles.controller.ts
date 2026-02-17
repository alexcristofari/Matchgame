import { Router, Response } from 'express';
import { prisma } from '../../shared/db';
import { authMiddleware, AuthRequest } from '../../shared/middleware/auth.middleware';
import { createProfileSchema, updateProfileSchema } from './profiles.schema';
import { ZodError } from 'zod';
import { uploadMiddleware } from '../../shared/middleware/upload.middleware';
import { uploadToSupabase } from '../../shared/services/upload.service';

export const profilesRouter = Router();

// GET /api/profiles/me - Get current user's profile
profilesRouter.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user!.userId }
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Perfil não encontrado. Crie um perfil primeiro.'
            });
        }

        res.json({
            success: true,
            data: {
                ...profile,
                photos: JSON.parse(profile.photos)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar perfil'
        });
    }
});

// POST /api/profiles - Create profile
profilesRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const input = createProfileSchema.parse(req.body);

        // Check if profile already exists
        const existing = await prisma.profile.findUnique({
            where: { userId: req.user!.userId }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Perfil já existe. Use PATCH para atualizar.'
            });
        }

        const profile = await prisma.profile.create({
            data: {
                userId: req.user!.userId,
                bio: input.bio,
                birthDate: input.birthDate,
                location: input.location,
                lookingFor: input.lookingFor,
                photos: JSON.stringify(input.photos)
            }
        });

        res.status(201).json({
            success: true,
            data: {
                ...profile,
                photos: JSON.parse(profile.photos)
            }
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Erro ao criar perfil'
        });
    }
});

// PATCH /api/profiles/me - Update profile
profilesRouter.patch('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const input = updateProfileSchema.parse(req.body);

        const updateData: Record<string, unknown> = {};
        if (input.bio !== undefined) updateData.bio = input.bio;
        if (input.birthDate !== undefined) updateData.birthDate = input.birthDate;
        if (input.location !== undefined) updateData.location = input.location;
        if (input.lookingFor !== undefined) updateData.lookingFor = input.lookingFor;
        if (input.photos !== undefined) updateData.photos = JSON.stringify(input.photos);

        const profile = await prisma.profile.update({
            where: { userId: req.user!.userId },
            data: updateData
        });

        res.json({
            success: true,
            data: {
                ...profile,
                photos: JSON.parse(profile.photos)
            }
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar perfil'
        });
    }
});

// POST /api/profiles/upload - Upload profile photo
profilesRouter.post('/upload', authMiddleware, uploadMiddleware.single('photo'), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhuma imagem enviada'
            });
        }

        const photoUrl = await uploadToSupabase(req.file.buffer, req.file.mimetype);

        res.json({
            success: true,
            data: { url: photoUrl }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao fazer upload da imagem'
        });
    }
});

// GET /api/profiles/:userId - Get another user's profile (public info only)
profilesRouter.get('/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Perfil não encontrado'
            });
        }

        res.json({
            success: true,
            data: {
                id: profile.id,
                userId: profile.userId,
                name: profile.user.name,
                bio: profile.bio,
                location: profile.location,
                lookingFor: profile.lookingFor,
                photos: JSON.parse(profile.photos)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar perfil'
        });
    }
});
