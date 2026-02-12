"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useChat } from '@/hooks/useChat';

interface MatchDetails {
    id: string;
    partner: {
        id: string;
        name: string;
        image: string | null;
    };
}

export default function ChatPage() {
    const params = useParams();
    const matchId = params.id as string;
    const { user } = useAuthStore();
    const router = useRouter();
    const [match, setMatch] = useState<MatchDetails | null>(null);
    const [inputValue, setInputValue] = useState('');

    const { messages, isLoading, sendMessage } = useChat(matchId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Match Details (Header)
    useEffect(() => {
        const fetchMatch = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/matches/${matchId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setMatch(data.data);
                } else {
                    router.push('/matches'); // Redirect if not found/auth
                }
            } catch (error) {
                console.error('Failed to fetch match:', error);
            }
        };

        if (matchId) fetchMatch();
    }, [matchId, router]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    if (!match || !user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-900 border-b border-gray-800 z-10">
                <Link href="/matches" className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </Link>

                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                    {match.partner.image ? (
                        <img src={match.partner.image} alt={match.partner.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">{match.partner.name[0]}</div>
                    )}
                </div>

                <div className="font-semibold">{match.partner.name}</div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="text-center text-gray-500 mt-10">Loading history...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Start the conversation! 💬</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMine = msg.senderId === user.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl break-words ${isMine
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                                        } ${msg.isSending ? 'opacity-70' : ''}`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="bg-blue-600 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
