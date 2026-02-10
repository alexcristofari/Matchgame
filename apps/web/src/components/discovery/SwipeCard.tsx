'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface SwipeCardProps {
    user: any;
    onSwipe: (direction: 'left' | 'right' | 'up') => void;
    active: boolean;
}

export default function SwipeCard({ user, onSwipe, active }: SwipeCardProps) {
    const [exitX, setExitX] = useState<number | null>(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const passOpacity = useTransform(x, [-100, -10], [0, 1]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        if (!active) return;

        const threshold = 100;
        if (info.offset.x > threshold) {
            setExitX(200);
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            setExitX(-200);
            onSwipe('left');
        } else {
            // Reset position
        }
    };

    if (!active) return null;

    // Photos logic
    const photoUrl = user.photos && user.photos.length > 0
        ? user.photos[0]
        : 'https://via.placeholder.com/400x600?text=No+Photo';

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag={active ? "x" : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1, x: exitX !== null ? exitX : 0 }}
            exit={{ x: exitX !== null ? exitX : 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 cursor-grab active:cursor-grabbing border border-white/10"
        >
            {/* Image */}
            <div
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${photoUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

            {/* Stamps */}
            <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-8 border-4 border-green-500 bg-green-500/20 text-green-500 rounded-lg px-4 py-2 transform -rotate-12 z-20 pointer-events-none"
            >
                <span className="text-4xl font-bold uppercase tracking-widest">Like</span>
            </motion.div>

            <motion.div
                style={{ opacity: passOpacity }}
                className="absolute top-8 right-8 border-4 border-red-500 bg-red-500/20 text-red-500 rounded-lg px-4 py-2 transform rotate-12 z-20 pointer-events-none"
            >
                <span className="text-4xl font-bold uppercase tracking-widest">Nope</span>
            </motion.div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white pointer-events-none z-10 bg-gradient-to-t from-black to-transparent pt-20">
                <div className="flex items-end gap-3 mb-2">
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    <span className="text-xl font-medium opacity-80">{user.age}</span>
                </div>

                {user.location && (
                    <div className="flex items-center gap-1 text-sm opacity-70 mb-3">
                        <span>📍</span>
                        <span>{user.location}</span>
                    </div>
                )}

                {user.bio && (
                    <p className="text-sm opacity-80 line-clamp-2 mb-4">
                        {user.bio}
                    </p>
                )}

                {/* Top Interests */}
                <div className="flex gap-2">
                    {user.topGame && (
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs">
                            <span>🎮</span>
                            <span className="truncate max-w-[100px]">{user.topGame.name}</span>
                        </div>
                    )}
                    {user.topSong && (
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs">
                            <span>🎵</span>
                            <span className="truncate max-w-[100px]">{user.topSong.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
