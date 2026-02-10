'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { discoveryApi } from '@/services/api';
import SwipeCard from '@/components/discovery/SwipeCard';

export default function DiscoverPage() {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState<any | null>(null);

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const res = await discoveryApi.getRecommendations();
            if (res.success) {
                setRecommendations(res.data);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
        if (recommendations.length === 0) return;

        const currentProfile = recommendations[recommendations.length - 1];

        // Optimistic update
        setRecommendations(prev => prev.slice(0, -1));

        try {
            const action = direction === 'right' ? 'like' : direction === 'up' ? 'superlike' : 'pass';
            const res = await discoveryApi.swipe(currentProfile.id, action);

            if (res.success && res.data.match) {
                setMatch(currentProfile);
            }
        } catch (error) {
            console.error('Swipe error:', error);
            // Revert? Complex with animations. For now, just log.
        }
    };

    const manualSwipe = (direction: 'left' | 'right') => {
        // Trigger user swipe programmatically (simulated)
        // In a real app, we'd ref the card to trigger its exit animation
        // For now, we just call handleSwipe, but the animation might just pop
        handleSwipe(direction);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex flex-col">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/pxfuel1.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 p-4 flex justify-between items-center max-w-md mx-auto w-full">
                <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition-colors">
                    <span className="text-xl">←</span>
                </Link>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                    Discover
                </h1>
                <div className="w-10" /> {/* Spacer */}
            </header>

            {/* Cards Container */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto px-4 perspective-1000">
                <div className="relative w-full aspect-[3/4] max-h-[600px]">
                    <AnimatePresence>
                        {recommendations.length > 0 ? (
                            recommendations.map((user, index) => (
                                <SwipeCard
                                    key={user.id}
                                    user={user}
                                    active={index === recommendations.length - 1}
                                    onSwipe={handleSwipe}
                                />
                            ))
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-zinc-900/50 backdrop-blur rounded-3xl border border-white/10">
                                <div className="text-6xl mb-4">😴</div>
                                <h3 className="text-2xl font-bold mb-2">Sem novos perfis</h3>
                                <p className="text-gray-400 mb-6">Volte mais tarde para ver novas pessoas!</p>
                                <button
                                    onClick={loadRecommendations}
                                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 font-medium transition-colors"
                                >
                                    Atualizar
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                {recommendations.length > 0 && (
                    <div className="flex items-center gap-6 mt-8 z-10">
                        <button
                            onClick={() => manualSwipe('left')}
                            className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-red-500/30 text-red-500 flex items-center justify-center text-3xl shadow-lg hover:scale-110 hover:bg-red-500/10 transition-all"
                        >
                            ✕
                        </button>

                        <button
                            className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-blue-500/30 text-blue-500 flex items-center justify-center text-xl shadow-lg hover:scale-110 hover:bg-blue-500/10 transition-all"
                            onClick={() => alert('Superlike coming soon!')}
                        >
                            ★
                        </button>

                        <button
                            onClick={() => manualSwipe('right')}
                            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 hover:shadow-pink-500/25 transition-all text-white overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500" />
                            <span className="relative z-10">♥</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Match Modal */}
            <AnimatePresence>
                {match && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <h2 className="text-6xl font-bold mb-2 italic bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                It's a Match!
                            </h2>
                            <p className="text-xl text-gray-300 mb-12">
                                Você e {match.name} se curtiram.
                            </p>

                            <div className="flex gap-8 justify-center mb-12">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img src={match.photos?.[0] || 'https://via.placeholder.com/150'} alt={match.name} className="w-full h-full object-cover" />
                                </div>
                                {/* User's photo would go here if we had it in context/store easily */}
                            </div>

                            <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                                <button className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 font-bold text-lg hover:opacity-90 transition-opacity">
                                    Enviar Mensagem
                                </button>
                                <button
                                    onClick={() => setMatch(null)}
                                    className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 font-medium transition-colors"
                                >
                                    Continuar Swiping
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
