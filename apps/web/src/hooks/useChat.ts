import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuthStore } from '@/store/auth';

export interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
    isSending?: boolean; // Optimistic UI
}

interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (content: string) => void;
    matchId: string;
}

export const useChat = (matchId: string): UseChatReturn => {
    const { socket, isConnected } = useSocket();
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial history
    useEffect(() => {
        const fetchHistory = async () => {
            if (!matchId) return;
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/matches/${matchId}/messages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [matchId]);

    // Socket listeners
    useEffect(() => {
        if (!socket || !isConnected || !matchId) return;

        const handleNewMessage = (msg: Message) => {
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };

        const handleMessageSent = (msg: Message) => {
            setMessages(prev => prev.map(m =>
                (m.content === msg.content && m.isSending) ? msg : m
            ));
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_sent', handleMessageSent);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.off('message_sent', handleMessageSent);
        };
    }, [socket, isConnected, matchId]);

    const sendMessage = (content: string) => {
        if (!socket || !content.trim() || !user) return;

        // Optimistic update
        const tempId = Date.now().toString();
        const optimisticMsg: Message = {
            id: tempId,
            senderId: user.id,
            content: content,
            createdAt: new Date().toISOString(),
            isSending: true
        };

        setMessages(prev => [...prev, optimisticMsg]);

        socket.emit('send_message', { matchId, content });
    };

    return { messages, isLoading, sendMessage, matchId };
};
