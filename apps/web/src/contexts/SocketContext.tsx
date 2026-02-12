"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (!token || !user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
            auth: {
                token: token
            },
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
            console.log('🔌 Connected to Chat Server');
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔌 Disconnected from Chat Server');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err.message);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
