import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './modules/auth/auth.controller';
import { usersRouter } from './modules/users/users.controller';
import { profilesRouter } from './modules/profiles/profiles.controller';
import { integrationsRouter } from './modules/integrations/integrations.controller';
import { favoritesRouter } from './modules/favorites/favorites.controller';
import { matchesRouter } from './modules/matches/matches.controller';

import { createServer } from 'http';
import { initializeSocket } from './modules/chat/socket.service';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: true, // Allow any origin (for development)
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
    try {
        await import('./shared/db').then(m => m.prisma.$queryRaw`SELECT 1`);
        res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', db: 'disconnected', error: String(error) });
    }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/matches', matchesRouter);

// Proxy Route (Bypass CORS/CSP for images)
import { proxyRouter } from './modules/proxy/proxy.controller';
app.use('/api/proxy', proxyRouter);

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io enabled`);
    console.log(`📝 API docs: http://localhost:${PORT}/health`);

    // Start Spotify callback HTTPS server
    import('./modules/integrations/spotify-callback-server').then(({ startSpotifyCallbackServer }) => {
        startSpotifyCallbackServer();
    }).catch(console.error);
});

export default app;
