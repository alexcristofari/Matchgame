import { z } from 'zod';

export const createProfileSchema = z.object({
    bio: z.string().max(500, 'Bio muito longa').optional(),
    birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    location: z.string().optional(),
    lookingFor: z.enum(['friendship', 'relationship', 'both']).default('both'),
    photos: z.array(z.string().url()).max(6, 'Máximo de 6 fotos').default([])
});

export const updateProfileSchema = createProfileSchema.partial();

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
