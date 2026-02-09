'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { usersApi, profilesApi, integrationsApi } from '@/services/api';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuthStore();
    const [profile, setProfile] = useState<{ bio?: string; location?: string; birthDate?: string; lookingFor?: string } | null>(null);
    const [favorites, setFavorites] = useState<{ appid: number; name: string; iconUrl?: string }[]>([]);
    const [spotifyData, setSpotifyData] = useState<{ profileUrl?: string; playlists?: string[]; genres?: string[]; topSongs?: { name: string; artist: string; url: string; imageUrl?: string }[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!isAuthenticated) return;
            try {
                // Parallel requests
                const [profileRes, favoritesRes, spotifyRes] = await Promise.all([
                    profilesApi.getMyProfile().catch(() => ({ success: false, data: null })),
                    integrationsApi.getFavoriteGames().catch(() => ({ success: false, data: [] })),
                    integrationsApi.getSpotify().catch(() => ({ success: false, data: null }))
                ]);

                if (profileRes.success) setProfile(profileRes.data);
                if (favoritesRes.success) {
                    setFavorites(favoritesRes.data.map((f: any) => ({
                        appid: Number(f.appid),
                        name: f.name,
                        iconUrl: f.iconUrl
                    })));
                }

                if (spotifyRes.success && spotifyRes.data) {
                    const data = spotifyRes.data;
                    setSpotifyData({
                        profileUrl: data.profileUrl,
                        playlists: data.playlists || [],
                        genres: data.genres || (data.topArtists ? data.topArtists.flatMap((a: any) => a.genres).slice(0, 5) : []),
                        topSongs: data.topSongs || (data.topArtists ? data.topArtists.slice(0, 5).map((a: any) => ({
                            name: a.name, // In real integration we only have artists, mapping artist to song-like structure for now or we should change UI
                            artist: 'Top Artist',
                            url: '',
                            imageUrl: a.imageUrl
                        })) : [])
                    });
                }
            } catch (error) {
                console.error('Error loading profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <div className="spinner w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const mainGame = favorites[0];
    const otherGames = favorites.slice(1);
    const mainSong = spotifyData?.topSongs?.[0];
    const otherSongs = spotifyData?.topSongs?.slice(1) || [];

    // Helper to get Spotify Embed URL
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            // https://open.spotify.com/track/ID -> https://open.spotify.com/embed/track/ID
            if (urlObj.pathname.startsWith('/track/') || urlObj.pathname.startsWith('/playlist/') || urlObj.pathname.startsWith('/album/')) {
                return `https://open.spotify.com/embed${urlObj.pathname}`;
            }
            return null;
        } catch {
            return null;
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-20 overflow-x-hidden">
            {/* Header / Navigation */}
            <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <Link href="/dashboard" className="text-xl font-bold tracking-wider">
                    MATCHGAME
                </Link>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
            </header>

            {/* Hero Profile Section */}
            <section className="pt-32 pb-12 px-6 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row gap-8 items-end"
                >
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                        <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                            <span className="text-4xl md:text-6xl font-bold text-gray-400">
                                {user?.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">{user?.name}</h1>
                        <p className="text-gray-400 text-lg mb-4">{profile?.bio || 'No bio yet...'}</p>

                        <div className="flex flex-wrap gap-3">
                            {profile?.location && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-sm flex items-center gap-2">
                                    📍 {profile.location}
                                </span>
                            )}
                            {profile?.lookingFor && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-sm flex items-center gap-2">
                                    ❤️ Looking for: {profile.lookingFor}
                                </span>
                            )}
                            <Link href="/dashboard" className="px-4 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors">
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Content Grid */}
            <div className="px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Games */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-purple-400">🎮</span> Favorite Games
                    </h2>

                    {mainGame ? (
                        <div className="relative group rounded-2xl overflow-hidden aspect-video bg-[#1a1a1a] border border-white/10">
                            {mainGame.iconUrl ? (
                                <img
                                    src={mainGame.iconUrl}
                                    alt={mainGame.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://cdn.cloudflare.steamstatic.com/steam/apps/${mainGame.appid}/header.jpg`
                                    }}
                                />
                            ) : (
                                <img
                                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${mainGame.appid}/header.jpg`}
                                    alt={mainGame.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                                <span className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-1">Top Pick</span>
                                <h3 className="text-3xl font-bold">{mainGame.name}</h3>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-dashed border-white/20 text-center">
                            <p className="text-gray-400">No favorite games selected</p>
                            <Link href="/dashboard" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
                                Add games
                            </Link>
                        </div>
                    )}

                    {otherGames.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                            {otherGames.map(game => (
                                <div key={game.appid} className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-3">
                                    {game.iconUrl && (
                                        <img
                                            src={game.iconUrl}
                                            alt={game.name}
                                            className="w-10 h-10 rounded-lg bg-[#252525]"
                                        />
                                    )}
                                    <span className="font-medium text-sm truncate">{game.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Music */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-8"
                >
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-green-400">🎵</span> Music Taste
                    </h2>

                    {/* Genres Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        {spotifyData?.genres && spotifyData.genres.map((genre, i) => (
                            <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors capitalize">
                                {genre}
                            </span>
                        ))}
                        {spotifyData?.profileUrl && (
                            <a href={spotifyData.profileUrl} target="_blank" className="ml-auto text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                                Spotify Profile ↗
                            </a>
                        )}
                    </div>

                    {/* Main Song Embed */}
                    {mainSong && mainSong.url && getEmbedUrl(mainSong.url) ? (
                        <div className="rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl shadow-green-900/10">
                            <iframe
                                style={{ borderRadius: '12px' }}
                                src={getEmbedUrl(mainSong.url)!}
                                width="100%"
                                height="152"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    ) : mainSong ? (
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1db954]/20 to-[#191414] border border-green-500/20">
                            <h3 className="text-xl font-bold text-green-400 mb-1">{mainSong.name}</h3>
                            <p className="text-white/60">{mainSong.artist}</p>
                            <a href={mainSong.url} target="_blank" className="text-xs text-white/40 hover:text-white mt-4 block">Open in Spotify ↗</a>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-dashed border-white/20 text-center">
                            <p className="text-gray-400">No music profile setup</p>
                            <Link href="/dashboard" className="text-green-400 text-sm hover:underline mt-2 inline-block">
                                Setup music profile
                            </Link>
                        </div>
                    )}

                    {/* Top Songs List */}
                    {otherSongs.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Top Rotation</h3>
                            {otherSongs.map((song, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <span className="text-gray-600 font-mono text-sm w-4">{i + 2}</span>
                                        {song.imageUrl && (
                                            <img src={song.imageUrl} alt={song.name} className="w-10 h-10 rounded bg-[#252525] object-cover" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{song.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                        </div>
                                    </div>
                                    {song.url && (
                                        <a href={song.url} target="_blank" className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white transition-opacity">
                                            ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}
