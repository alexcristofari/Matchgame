'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

interface PublicProfile {
    id: string;
    userId: string;
    name: string;
    bio: string;
    location: string;
    lookingFor: string;
    photos: string[];
}

export default function PublicProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const userId = params.id as string;

    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Placeholder data for interests (In a real app, we'd fetch these public details too)
    // For now, let's assume we can fetch at least the main profile info
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profiles/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setProfile(data.data);
                } else {
                    // Profile not found or error
                    console.error(data.error);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchProfile();
    }, [userId]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-orange-500 rounded-full border-t-transparent" /></div>;

    if (!profile) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Profile not found</div>;

    const isMe = user?.id === userId;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-20 overflow-x-hidden relative">
            {/* Background Gradients (Standardized Purple/Orange) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition">←</button>
                    <span className="font-bold tracking-wider text-lg">PROFILE</span>
                </div>
                {isMe && (
                    <Link href="/dashboard" className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition">
                        Edit
                    </Link>
                )}
            </header>

            {/* Hero Profile Section */}
            <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block relative mb-6"
                >
                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                            {profile.photos?.[0] ? (
                                <img src={profile.photos[0]} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-gray-800">
                                    {profile.name[0]}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                <p className="text-gray-400 text-lg max-w-lg mx-auto mb-6 leading-relaxed">
                    {profile.bio || 'Sem bio...'}
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                    {profile.location && (
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2">
                            📍 {profile.location}
                        </span>
                    )}
                    {profile.lookingFor && (
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm flex items-center gap-2 text-orange-300">
                            🎯 {profile.lookingFor}
                        </span>
                    )}
                </div>
            </section>

            {/* TODO: Add sections for Games, Music, etc when public endpoints are available for those details */}
            <div className="px-6 max-w-4xl mx-auto text-center py-12 border-t border-white/10">
                <p className="text-gray-500 italic">User details (Games, Music, Anime) coming soon to public view...</p>
            </div>

            {!isMe && (
                <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
                    <Link
                        href={`/matches/${profile.id}`} // Assuming match ID is somehow linked or we start chat
                        className="pointer-events-auto bg-gradient-to-r from-orange-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <span>💬</span> Send Message
                    </Link>
                </div>
            )}
        </main>
    );
}
