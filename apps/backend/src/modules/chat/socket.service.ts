import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { prisma } from '../../shared/db';
import { encryption } from '../../shared/utils/encryption';
import { AuthService } from '../auth/auth.service';

interface AuthPayload {
    userId: string;
    email: string;
}

export const initializeSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Adjust for production
            methods: ["GET", "POST"]
        }
    });

    // Middleware de Autenticação
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication error: Token required"));
        }

        try {
            // Use AuthService to verify token
            const decoded = AuthService.verifyAccessToken(token);
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = socket.data.user.userId;
        console.log(`🔌 User connected: ${userId}`);

        // Join user's own room for private messages
        socket.join(`user_${userId}`);

        // Handle sending messages
        socket.on('send_message', async (data: { matchId: string, content: string }) => {
            try {
                const { matchId, content } = data;

                // 1. Validate Match
                const match = await prisma.match.findUnique({
                    where: { id: matchId },
                    include: { user1: true, user2: true }
                });

                if (!match) {
                    socket.emit('error', { message: 'Match not found' });
                    return;
                }

                if (match.user1Id !== userId && match.user2Id !== userId) {
                    socket.emit('error', { message: 'Unauthorized' });
                    return;
                }

                const receiverId = match.user1Id === userId ? match.user2Id : match.user1Id;

                // 2. Encrypt Content
                const encryptedContent = encryption.encrypt(content);

                // 3. Save to DB
                const message = await prisma.message.create({
                    data: {
                        matchId,
                        senderId: userId,
                        content: encryptedContent,
                        readAt: null
                    }
                });

                // 4. Send to Receiver (decrypted for now, or let client decrypt? 
                //    Better: send plain text to socket, but encrypted in DB)
                //    Wait, client expects plain text. We decrypt before sending.
                //    Actually, we already have the plain content.

                const messagePayload = {
                    id: message.id,
                    matchId,
                    senderId: userId,
                    content: content, // Send plain text deeply
                    createdAt: message.createdAt
                };

                // Emit to receiver's room
                io.to(`user_${receiverId}`).emit('new_message', messagePayload);

                // Emit back to sender (confirm sent)
                socket.emit('message_sent', messagePayload);

            } catch (error) {
                console.error('Socket error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔌 User disconnected: ${userId}`);
        });
    });

    return io;
};
