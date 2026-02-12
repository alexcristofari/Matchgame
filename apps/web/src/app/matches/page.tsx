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
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-white/10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Matches
                </h1>
            </div>

            {/* List */}
            <div className="p-4 space-y-4">
                {matches.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <p>No matches yet. Go swipe some more! 🚀</p>
                        <Link
                            href="/discover"
                            className="inline-block mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            Go to Discover
                        </Link>
                    </div>
                ) : (
                    matches.map((match) => (
                        <Link
                            key={match.id}
                            href={`/matches/${match.id}`}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors active:scale-95 duration-200"
                        >
                            {/* Avatar */}
                            <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                {match.partner.image ? (
                                    <img
                                        src={match.partner.image}
                                        alt={match.partner.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-xl">
                                        {match.partner.name[0]}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate">
                                    {match.partner.name}
                                </h3>
                                <p className="text-sm text-gray-400 truncate">
                                    {match.lastMessage
                                        ? match.lastMessage.content
                                        : <span className="text-pink-500 italic">New Match! Say hi 👋</span>
                                    }
                                </p>
                            </div>

                            {/* Time/Status (Optional) */}
                            {match.lastMessage && (
                                <div className="text-xs text-gray-600 self-start mt-1">
                                    {new Date(match.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}
                        </Link>
                    ))
                )}
            </div>

            {/* Bottom Nav Placeholder (Back to Discover) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                <div className="flex justify-center pointer-events-auto">
                    <Link href="/discover" className="p-3 bg-gray-800 rounded-full text-white shadow-lg hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
