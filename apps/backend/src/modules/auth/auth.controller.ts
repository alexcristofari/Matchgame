import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';
import { ZodError } from 'zod';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const input = registerSchema.parse(req.body);
        const result = await AuthService.register(input);

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0].message
            });
        }

        const message = error instanceof Error ? error.message : 'Erro ao registrar';
        res.status(400).json({
            success: false,
            error: message
        });
    }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const input = loginSchema.parse(req.body);
        const result = await AuthService.login(input);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0].message
            });
        }

        const message = error instanceof Error ? error.message : 'Erro ao fazer login';
        res.status(401).json({
            success: false,
            error: message
        });
    }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const tokens = await AuthService.refresh(refreshToken);

        res.json({
            success: true,
            data: tokens
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: error.errors[0].message
            });
        }

        res.status(401).json({
            success: false,
            error: 'Token inválido ou expirado'
        });
    }
});

// POST /api/auth/logout
authRouter.post('/logout', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await AuthService.logout(refreshToken);
        }

        res.json({
            success: true,
            data: { message: 'Logout realizado com sucesso' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao fazer logout'
        });
    }
});

// GET /api/auth/me - Get current user (protected)
authRouter.get('/me', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Token não fornecido'
            });
        }

        const token = authHeader.split(' ')[1];
        const payload = AuthService.verifyAccessToken(token);

        res.json({
            success: true,
            data: { userId: payload.userId, email: payload.email }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }
});
