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
                    router.push('/matches');
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
        <div className="flex flex-col h-screen bg-black text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10 p-3 flex items-center gap-4">
                <Link href="/matches" className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </Link>

                <Link href={`/profile/${match.partner.id}`} className="flex items-center gap-3 hover:opacity-80 transition">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-800 ring-2 ring-white/10">
                        {match.partner.image ? (
                            <img src={match.partner.image} alt={match.partner.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-sm font-bold">{match.partner.name[0]}</div>
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-sm bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{match.partner.name}</div>
                        <div className="text-[10px] text-green-400 font-medium">Online now</div>
                    </div>
                </Link>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pt-24 pb-24 z-10 scrollbar-hide">
                {isLoading ? (
                    <div className="text-center text-gray-600 text-xs mt-10">Loading history...</div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-50">
                        <div className="text-4xl">👋</div>
                        <p className="text-sm">No messages yet.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMine = msg.senderId === user.id;
                        const showAvatar = !isMine && (idx === 0 || messages[idx - 1].senderId !== msg.senderId);

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMine ? 'justify-end' : 'justify-start items-end gap-2'}`}
                            >
                                {/* Partner Avatar (Small) */}
                                {!isMine && (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-700 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                        {match.partner.image ? (
                                            <img src={match.partner.image} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full" />
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl break-words shadow-sm text-sm ${isMine
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none'
                                            : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/5'
                                        } ${msg.isSending ? 'opacity-70 scale-[0.98]' : 'scale-100'} transition-all`}
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
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-xl border-t border-white/10 z-20">
                <form onSubmit={handleSend} className="flex gap-3 items-center max-w-4xl mx-auto">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                    </button>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 p-3 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
