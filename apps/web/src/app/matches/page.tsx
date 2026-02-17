"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

interface MatchItem {
    id: string;
    partner: {
        id: string;
        name: string;
        image: string | null;
    };
    lastMessage: {
        content: string;
        createdAt: string;
    } | null;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/matches`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setMatches(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch matches:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchMatches();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-xl p-4 border-b border-white/10 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Messages
                </h1>
                <Link href="/discover" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </Link>
            </div>

            {/* List */}
            <div className="p-4 space-y-3 z-0 relative">
                {matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center mt-32 space-y-4">
                        <div className="text-6xl">😴</div>
                        <div className="text-gray-400 max-w-xs">
                            It's quiet here... Go find your player 2!
                        </div>
                        <Link
                            href="/discover"
                            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-transform"
                        >
                            Start Swiping
                        </Link>
                    </div>
                ) : (
                    matches.map((match) => (
                        <Link
                            key={match.id}
                            href={`/matches/${match.id}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-[0.98] backdrop-blur-sm group"
                        >
                            {/* Avatar */}
                            {/* Avatar */}
                            <Link
                                href={`/profile/${match.partner.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-800 ring-2 ring-transparent group-hover:ring-purple-500/50 transition-all hover:scale-110 z-10"
                            >
                                {match.partner.image ? (
                                    <img
                                        src={match.partner.image}
                                        alt={match.partner.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-gray-700 to-gray-900">
                                        {match.partner.name[0]}
                                    </div>
                                )}
                            </Link>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-lg text-white truncate group-hover:text-purple-300 transition-colors">
                                        {match.partner.name}
                                    </h3>
                                    {match.lastMessage && (
                                        <span className="text-xs text-gray-500">
                                            {formatTime(match.lastMessage.createdAt)}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm truncate ${!match.lastMessage ? 'text-pink-400 font-medium' : 'text-gray-400'}`}>
                                    {match.lastMessage
                                        ? match.lastMessage.content
                                        : '✨ New Match! Say hi!'}
                                </p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
                <nav className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center gap-8">
                    <Link href="/discover" className="text-gray-400 hover:text-white transition-colors flex flex-col items-center gap-1 group">
                        <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
                        </div>
                    </Link>

                    <Link href="/matches" className="text-pink-500 flex flex-col items-center gap-1">
                        <div className="p-2 rounded-full bg-pink-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </div>
                    </Link>

                    <Link href="/profile" className="text-gray-400 hover:text-white transition-colors flex flex-col items-center gap-1 group">
                        <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                    </Link>
                </nav>
            </div>
        </div>
    );
}

function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // If < 24h, show time
    if (diff < 86400000 && now.getDate() === date.getDate()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Else show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
