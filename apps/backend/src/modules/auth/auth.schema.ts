import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula')
        .regex(/[0-9]/, 'Senha deve ter pelo menos um número'),
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres')
});

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória')
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token é obrigatório')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
