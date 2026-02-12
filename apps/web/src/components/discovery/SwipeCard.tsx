
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
    const [showDetails, setShowDetails] = useState(false);

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
    const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    let photoUrl = 'https://via.placeholder.com/400x600?text=No+Photo';

    if (user.photos && user.photos.length > 0) {
        const originalUrl = user.photos[0];
        // Use local files if possible
        if (originalUrl.includes('api.dicebear.com')) {
            photoUrl = `/avatars/${sanitizeName(user.name)}.svg`;
        } else if (originalUrl.includes('wikimedia') || originalUrl.includes('dropbox') || originalUrl.includes('imgur')) {
            photoUrl = `/avatars/${sanitizeName(user.name)}.jpg`;
        } else {
            photoUrl = originalUrl;
        }
    }

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
            <img
                src={photoUrl}
                alt={user.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
                onError={(e) => {
                    const target = e.currentTarget;
                    const src = target.src;

                    // Try alternatives if initial load fails
                    if (src.endsWith('.svg')) {
                        // Sometimes we expect SVG but it might be JPG (e.g. manual replace)
                        target.src = src.replace('.svg', '.jpg');
                    } else if (src.endsWith('.jpg')) {
                        // User might have saved as .jpeg
                        target.src = src.replace('.jpg', '.jpeg');
                    } else if (src.endsWith('.jpeg')) {
                        // User might have saved as .png
                        target.src = src.replace('.jpeg', '.png');
                    } else if (src.endsWith('.png')) {
                        // Or webp
                        target.src = src.replace('.png', '.webp');
                    } else {
                        // Only fallback to placeholder if all formats fail
                        if (!src.includes('placeholder')) {
                            target.src = 'https://via.placeholder.com/600x800?text=Image+Offline';
                        }
                    }
                }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none transition-all duration-300 ${showDetails ? 'from-black/90 via-black/80' : ''}`} />

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
            <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 pt-20">
                <div
                    className="cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDetails(!showDetails);
                    }}
                >
                    <div className="flex items-end justify-between mb-2">
                        <div className="flex items-end gap-3">
                            <h2 className="text-3xl font-bold leading-none">{user.name}</h2>
                            <span className="text-xl font-medium opacity-80 leading-none">{user.age}</span>
                        </div>
                        <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors pointer-events-auto">
                            {showDetails ? 'Hide Info' : 'More Info'}
                        </button>
                    </div>

                    {user.location && (
                        <div className="flex items-center gap-1 text-sm opacity-70 mb-3">
                            <span>📍</span>
                            <span>{user.location}</span>
                        </div>
                    )}

                    <div className={`text-sm opacity-80 mb-4 transition-all duration-300 ${showDetails ? 'max-h-[300px] overflow-y-auto' : 'line-clamp-2'}`}>
                        {user.bio}
                        {showDetails && (
                            <div className="mt-4 pt-4 border-t border-white/10 pointer-events-auto cursor-text" onPointerDown={(e) => e.stopPropagation()}>
                                <p className="text-xs text-gray-400 mb-2">FULL DEBUG DATA:</p>
                                <pre className="text-[10px] bg-black/50 p-2 rounded overflow-x-auto select-text">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Top Interests */}
                    {!showDetails && (
                        <div className="flex flex-wrap gap-2">
                            {user.favoriteGame && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs border border-white/5">
                                    <span>🎮</span>
                                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{user.favoriteGame}</span>
                                </div>
                            )}
                            {user.favoriteMovie && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs border border-white/5">
                                    <span>🎬</span>
                                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{user.favoriteMovie}</span>
                                </div>
                            )}
                            {user.favoriteMusic && (
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs border border-white/5">
                                    <span>🎵</span>
                                    <span className="truncate max-w-[80px] sm:max-w-[100px]">{user.favoriteMusic}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
