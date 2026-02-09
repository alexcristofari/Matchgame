import { z } from 'zod';

export const steamConnectSchema = z.object({
    steamId: z.string()
        .min(1, 'Steam ID é obrigatório')
        .regex(/^\d{17}$/, 'Steam ID deve ter 17 dígitos')
});

export const spotifyCallbackSchema = z.object({
    code: z.string().min(1, 'Código de autorização é obrigatório'),
    state: z.string().optional()
});

export type SteamConnectInput = z.infer<typeof steamConnectSchema>;
export type SpotifyCallbackInput = z.infer<typeof spotifyCallbackSchema>;
