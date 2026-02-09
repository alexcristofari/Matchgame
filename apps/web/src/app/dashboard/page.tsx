'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { usersApi, profilesApi } from '@/services/api';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, setUser } = useAuthStore();
    const [profile, setProfile] = useState<{ bio?: string; lookingFor?: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) { router.push('/auth/login'); return; }

            try {
                const userData = await usersApi.getMe();
                if (userData.success) {
                    setUser(userData.data);
                    try {
                        const profileData = await profilesApi.getMyProfile();
                        if (profileData.success) setProfile(profileData.data);
                    } catch { /* no profile */ }
                }
            } catch { logout(); router.push('/auth/login'); }
            finally { setLoading(false); }
        };
        checkAuth();
    }, [router, setUser, logout]);

    const handleLogout = () => { logout(); router.push('/auth/login'); };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-6 h-6" />
            </div>
        );
    }

    if (!isAuthenticated || !user) return null;

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Geometric elements */}
            <div className="geo-circle w-[400px] h-[400px] -right-48 -top-48 opacity-50" />
            <div className="geo-circle-outline w-24 h-24 left-20 bottom-1/4" />

            {/* Navigation */}
            <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-[#252525]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        <span className="text-black font-bold text-sm">M</span>
                    </div>
                    <span className="font-semibold tracking-wide text-sm">MATCHGAME</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="nav-link active">Dashboard</Link>
                    <Link href="/discover" className="nav-link">Discover</Link>
                    <Link href="/matches" className="nav-link">Matches</Link>
                    <Link href="/profile" className="nav-link">Profile</Link>
                </nav>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-500 hidden md:inline">{user.email}</span>
                    <button onClick={handleLogout} className="nav-link">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="relative z-10 px-8 py-10 max-w-5xl mx-auto">
                {/* Welcome section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="section-title mb-2">Dashboard</p>
                    <h1 className="heading-display-bold">
                        Hey, {user.name}
                    </h1>
                </motion.div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="section-title mb-6">Your Profile</p>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        {!profile && (
                            <Link href="/onboarding" className="btn-primary w-full justify-center text-xs">
                                Complete Profile
                            </Link>
                        )}
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="section-title mb-6">Your Stats</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-[#252525]">
                                <span className="text-sm text-gray-500">Integrations</span>
                                <span className="font-semibold">0 / 5</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-[#252525]">
                                <span className="text-sm text-gray-500">Favorites</span>
                                <span className="font-semibold">0 / 15</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-gray-500">Matches</span>
                                <span className="font-semibold">0</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Card */}
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <p className="section-title mb-6">Profile Progress</p>

                        <div className="flex items-center justify-center py-6">
                            <div className="relative w-28 h-28">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="56" cy="56" r="50" fill="none" stroke="#252525" strokeWidth="8" />
                                    <circle cx="56" cy="56" r="50" fill="none" stroke="white" strokeWidth="8" strokeDasharray="314" strokeDashoffset="314" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">0%</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-gray-500">Complete your profile to unlock matching</p>
                    </motion.div>
                </div>

                {/* Connect Accounts Section */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <p className="section-title mb-6">Connect Your Accounts</p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: '🎮', name: 'Steam', desc: 'Your game library' },
                            { icon: '🎵', name: 'Spotify', desc: 'Top artists & songs' },
                            { icon: '📺', name: 'MyAnimeList', desc: 'Anime watchlist' },
                            { icon: '🎬', name: 'TMDB', desc: 'Movies & shows' },
                        ].map((item, i) => (
                            <button
                                key={item.name}
                                className="card p-5 text-left hover:border-[#404040] transition-colors group"
                            >
                                <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">{item.icon}</span>
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
