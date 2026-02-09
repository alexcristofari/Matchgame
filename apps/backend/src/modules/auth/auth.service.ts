import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../../shared/db';
import type { RegisterInput, LoginInput } from './auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

interface TokenPayload {
    userId: string;
    email: string;
}

export class AuthService {
    // Generate JWT access token
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
    }

    // Generate refresh token (random string stored in DB)
    static async generateRefreshToken(userId: string): Promise<string> {
        const token = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

        await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt
            }
        });

        return token;
    }

    // Register new user
    static async register(input: RegisterInput) {
        const { email, password, name } = input;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true
            }
        });

        // Generate tokens
        const accessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            user,
            tokens: { accessToken, refreshToken }
        };
    }

    // Login user
    static async login(input: LoginInput) {
        const { email, password } = input;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            throw new Error('Credenciais inválidas');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new Error('Credenciais inválidas');
        }

        // Generate tokens
        const accessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await this.generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            tokens: { accessToken, refreshToken }
        };
    }

    // Refresh access token
    static async refresh(refreshToken: string) {
        // Find token in DB
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });

        if (!tokenRecord) {
            throw new Error('Token inválido');
        }

        // Check expiration
        if (tokenRecord.expiresAt < new Date()) {
            await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
            throw new Error('Token expirado');
        }

        // Delete old token (rotation)
        await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

        // Generate new tokens
        const accessToken = this.generateAccessToken({
            userId: tokenRecord.user.id,
            email: tokenRecord.user.email
        });
        const newRefreshToken = await this.generateRefreshToken(tokenRecord.user.id);

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }

    // Logout (invalidate refresh token)
    static async logout(refreshToken: string) {
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
    }

    // Verify access token
    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch {
            throw new Error('Token inválido');
        }
    }
}
