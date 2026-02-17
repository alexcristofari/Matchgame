'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { usersApi, profilesApi, integrationsApi } from '@/services/api';

type BookFavorite = { id: string; title: string; imageUrl: string; authors?: string[] };

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuthStore();
    const [profile, setProfile] = useState<any>(null);
    const [favorites, setFavorites] = useState<{ appid: number; name: string; iconUrl?: string }[]>([]);
    const [steamData, setSteamData] = useState<{ connected: boolean; profile?: { profileurl: string; personaname: string }; steamId?: string } | null>(null);
    const [spotifyData, setSpotifyData] = useState<{ profileUrl?: string; playlists?: string[]; genres?: string[]; topSongs?: { name: string; artist: string; url: string; imageUrl?: string }[] } | null>(null);
    const [animeData, setAnimeData] = useState<{ genres?: string[]; favorites?: { id: number; title: string; imageUrl: string }[]; profileUrl?: string } | null>(null);
    const [movieData, setMovieData] = useState<{ genres?: string[]; favorites?: { id: number; title: string; imageUrl: string }[]; profileUrl?: string } | null>(null);
    const [booksData, setBooksData] = useState<{ genres?: string[]; favorites?: BookFavorite[] } | null>(null);
    const [gameGenres, setGameGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!isAuthenticated) return;
            try {
                const [profileRes, favoritesRes, steamRes, spotifyRes, animeRes, movieRes, booksRes] = await Promise.all([
                    profilesApi.getMyProfile().catch(() => ({ success: false, data: null })),
                    integrationsApi.getFavoriteGames().catch(() => ({ success: false, data: [] })),
                    integrationsApi.getSteam().catch(() => ({ success: false, data: null })),
                    integrationsApi.getSpotify().catch(() => ({ success: false, data: null })),
                    integrationsApi.getAnime().catch(() => ({ success: false, data: null })),
                    integrationsApi.getMovie().catch(() => ({ success: false, data: null })),
                    integrationsApi.getBooks().catch(() => ({ success: false, data: null }))
                ]);

                if (profileRes.success) setProfile(profileRes.data);
                if (favoritesRes.success) {
                    setFavorites(favoritesRes.data.map((f: any) => ({
                        appid: Number(f.appid),
                        name: f.name,
                        iconUrl: f.iconUrl
                    })));
                }

                if (steamRes.success && steamRes.data) {
                    setSteamData(steamRes.data);
                    if (steamRes.data.genres) setGameGenres(steamRes.data.genres);
                }

                if (spotifyRes.success && spotifyRes.data) {
                    const data = spotifyRes.data;
                    setSpotifyData({
                        profileUrl: data.profileUrl,
                        playlists: data.playlists || [],
                        genres: data.genres || (data.topArtists ? data.topArtists.flatMap((a: any) => a.genres).slice(0, 5) : []),
                        topSongs: data.topSongs || (data.topArtists ? data.topArtists.slice(0, 5).map((a: any) => ({
                            name: a.name,
                            artist: 'Top Artist',
                            url: '',
                            imageUrl: a.imageUrl
                        })) : [])
                    });
                }

                if (animeRes.success && animeRes.data) setAnimeData(animeRes.data);
                if (movieRes.success && movieRes.data) setMovieData(movieRes.data);
                if (booksRes.success && booksRes.data) setBooksData(booksRes.data);
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
            <div className="min-h-screen flex items-center justify-center bg-[#060606] text-white">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    /* ── Helpers ── */

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }
    });

    const GenreTags = ({ genres }: { genres: string[] }) => (
        <div className="flex flex-wrap gap-1.5">
            {genres.map((g, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.05] border border-white/[0.08] text-white/50">
                    {g}
                </span>
            ))}
        </div>
    );

    const EmptyState = ({ icon, label }: { icon: string; label: string }) => (
        <div className="py-10 text-center rounded-2xl border border-dashed border-white/[0.06]">
            <span className="text-2xl mb-2 block opacity-20">{icon}</span>
            <p className="text-white/25 text-xs mb-2">Nenhum favorito</p>
            <Link href="/integrations" className="text-white/40 text-[11px] hover:text-white/70 underline underline-offset-4 transition-colors">
                Adicionar {label}
            </Link>
        </div>
    );

    const SectionHeader = ({ icon, title, link, linkLabel }: { icon: string; title: string; link?: string; linkLabel?: string }) => (
        <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white/90 tracking-tight">
                <span className="text-lg">{icon}</span>
                {title}
            </h2>
            {link && (
                <a href={link} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-white/25 hover:text-white/50 uppercase tracking-[0.15em] transition-colors">
                    {linkLabel || 'Perfil'} ↗
                </a>
            )}
        </div>
    );

    // Star badge for #1 items
    const FavBadge = () => (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/90 backdrop-blur-sm">
            <span className="text-[10px]">⭐</span>
            <span className="text-[9px] font-bold text-black uppercase tracking-wider">Favorito</span>
        </div>
    );

    /* ── Poster Card (anime / movies / books) ── */
    const PosterCard = ({ imageUrl, title, href, isFavorite, fallbackIcon }: {
        imageUrl?: string; title: string; href?: string; isFavorite?: boolean; fallbackIcon: string;
    }) => {
        const inner = (
            <div className={`group relative rounded-xl overflow-hidden bg-[#0c0c0c] border border-white/[0.04] transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/40 ${isFavorite ? 'ring-1 ring-yellow-500/30' : ''}`}>
                <div className="aspect-[2/3] relative">
                    {isFavorite && <FavBadge />}
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-15">{fallbackIcon}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[11px] font-semibold text-white/90 leading-tight line-clamp-2">{title}</p>
                </div>
            </div>
        );
        if (href) return <a href={href} target="_blank" rel="noopener noreferrer">{inner}</a>;
        return inner;
    };

    /* ── Game Card ── */
    const GameCard = ({ game, isFavorite, large }: { game: typeof favorites[0]; isFavorite?: boolean; large?: boolean }) => (
        <a
            href={`https://store.steampowered.com/app/${game.appid}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative rounded-xl overflow-hidden bg-[#0c0c0c] border border-white/[0.04] transition-all duration-300 hover:border-white/[0.1] hover:shadow-lg hover:shadow-black/40 ${isFavorite ? 'ring-1 ring-yellow-500/30' : ''}`}
        >
            <div className={`${large ? 'aspect-[21/9]' : 'aspect-[16/7]'} relative`}>
                {isFavorite && <FavBadge />}
                <img
                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className={`font-semibold text-white/90 leading-tight ${large ? 'text-lg' : 'text-xs'}`}>{game.name}</p>
            </div>
        </a>
    );

    const mainGame = favorites[0];
    const otherGames = favorites.slice(1);

    return (
        <main className="min-h-screen bg-[#060606] text-white">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.04]">
                <div className="max-w-4xl mx-auto px-5 py-3.5 flex justify-between items-center">
                    <Link href="/dashboard" className="text-sm font-bold tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                        MATCHGAME
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/integrations" className="text-xs text-white/35 hover:text-white/70 transition-colors">Integrações</Link>
                        <Link href="/dashboard" className="text-xs text-white/35 hover:text-white/70 transition-colors">Dashboard</Link>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-5 pt-24 pb-20">

                {/* ── Profile Hero ── */}
                <motion.section {...fadeUp(0)} className="mb-12">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] overflow-hidden flex-shrink-0 border border-white/[0.06]">
                            {profile?.photos && profile.photos.length > 0 ? (
                                <img src={profile.photos[0]} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/30">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold tracking-tight mb-0.5">{user?.name}</h1>
                            <p className="text-white/35 text-sm mb-2 line-clamp-2">{profile?.bio || 'Sem bio ainda...'}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {profile?.location && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] text-white/35 bg-white/[0.03] border border-white/[0.05]">
                                        📍 {profile.location}
                                    </span>
                                )}
                                {profile?.lookingFor && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] text-white/35 bg-white/[0.03] border border-white/[0.05]">
                                        Procurando: {profile.lookingFor}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ═══════════════════════════════════════ */}
                {/* ── 🎮 GAMES ── */}
                {/* ═══════════════════════════════════════ */}
                <motion.section {...fadeUp(0.08)} className="mb-12">
                    <SectionHeader
                        icon="🎮"
                        title="Jogos Favoritos"
                        link={steamData?.profile?.profileurl || (steamData?.steamId ? `https://steamcommunity.com/profiles/${steamData.steamId}` : undefined)}
                        linkLabel="Steam"
                    />

                    {gameGenres.length > 0 && <div className="mb-4"><GenreTags genres={gameGenres} /></div>}

                    {mainGame ? (
                        <div className="space-y-2.5">
                            <GameCard game={mainGame} isFavorite large />
                            {otherGames.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                    {otherGames.map(game => (
                                        <GameCard key={game.appid} game={game} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyState icon="🎮" label="jogos" />
                    )}
                </motion.section>

                {/* ═══════════════════════════════════════ */}
                {/* ── 🎵 MUSIC ── */}
                {/* ═══════════════════════════════════════ */}
                <motion.section {...fadeUp(0.14)} className="mb-12">
                    <SectionHeader
                        icon="🎵"
                        title="Gosto Musical"
                        link={spotifyData?.profileUrl}
                        linkLabel="Spotify"
                    />

                    {spotifyData?.genres && spotifyData.genres.length > 0 && (
                        <div className="mb-4"><GenreTags genres={spotifyData.genres} /></div>
                    )}

                    {spotifyData?.topSongs && spotifyData.topSongs.length > 0 ? (
                        <div className="rounded-xl border border-white/[0.04] bg-[#0a0a0a] divide-y divide-white/[0.03] overflow-hidden">
                            {spotifyData.topSongs.map((song, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.02] transition-colors group ${i === 0 ? 'bg-yellow-500/[0.03]' : ''}`}
                                >
                                    {/* Position / Star */}
                                    {i === 0 ? (
                                        <span className="text-yellow-500 text-xs w-5 text-center flex-shrink-0">⭐</span>
                                    ) : (
                                        <span className="text-[11px] font-mono text-white/20 w-5 text-center flex-shrink-0">{i + 1}</span>
                                    )}

                                    {/* Album Art */}
                                    {song.imageUrl ? (
                                        <img src={song.imageUrl} alt={song.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm flex-shrink-0">🎵</div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${i === 0 ? 'text-white' : 'text-white/75'}`}>{song.name}</p>
                                        <p className="text-[11px] text-white/30 truncate">{song.artist}</p>
                                    </div>

                                    {/* Link */}
                                    {song.url && (
                                        <a href={song.url} target="_blank" className="opacity-0 group-hover:opacity-100 text-white/25 hover:text-white/50 transition-all text-xs flex-shrink-0">
                                            ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="🎵" label="músicas" />
                    )}
                </motion.section>

                {/* ═══════════════════════════════════════ */}
                {/* ── 📺 ANIME ── */}
                {/* ═══════════════════════════════════════ */}
                <motion.section {...fadeUp(0.20)} className="mb-12">
                    <SectionHeader
                        icon="📺"
                        title="Animes"
                        link={animeData?.profileUrl}
                        linkLabel="MAL"
                    />

                    {animeData?.genres && animeData.genres.length > 0 && (
                        <div className="mb-4"><GenreTags genres={animeData.genres} /></div>
                    )}

                    {animeData?.favorites && animeData.favorites.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
                            {animeData.favorites.map((anime, i) => (
                                <PosterCard
                                    key={anime.id}
                                    imageUrl={anime.imageUrl}
                                    title={anime.title}
                                    href={`https://myanimelist.net/anime/${anime.id}`}
                                    isFavorite={i === 0}
                                    fallbackIcon="📺"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="📺" label="animes" />
                    )}
                </motion.section>

                {/* ═══════════════════════════════════════ */}
                {/* ── 🎬 MOVIES ── */}
                {/* ═══════════════════════════════════════ */}
                <motion.section {...fadeUp(0.26)} className="mb-12">
                    <SectionHeader
                        icon="🎬"
                        title="Filmes"
                        link={movieData?.profileUrl}
                        linkLabel="TMDB"
                    />

                    {movieData?.genres && movieData.genres.length > 0 && (
                        <div className="mb-4"><GenreTags genres={movieData.genres} /></div>
                    )}

                    {movieData?.favorites && movieData.favorites.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
                            {movieData.favorites.map((movie, i) => (
                                <PosterCard
                                    key={movie.id}
                                    imageUrl={movie.imageUrl}
                                    title={movie.title}
                                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                                    isFavorite={i === 0}
                                    fallbackIcon="🎬"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="🎬" label="filmes" />
                    )}
                </motion.section>

                {/* ═══════════════════════════════════════ */}
                {/* ── 📚 BOOKS ── */}
                {/* ═══════════════════════════════════════ */}
                <motion.section {...fadeUp(0.32)} className="mb-12">
                    <SectionHeader icon="📚" title="Livros" />

                    {booksData?.genres && booksData.genres.length > 0 && (
                        <div className="mb-4"><GenreTags genres={booksData.genres} /></div>
                    )}

                    {booksData?.favorites && booksData.favorites.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2.5">
                            {booksData.favorites.map((book, i) => (
                                <PosterCard
                                    key={book.id}
                                    imageUrl={book.imageUrl}
                                    title={book.title}
                                    isFavorite={i === 0}
                                    fallbackIcon="📚"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon="📚" label="livros" />
                    )}
                </motion.section>

                {/* ── Footer ── */}
                <motion.div {...fadeUp(0.38)} className="flex justify-center gap-3 pt-8 border-t border-white/[0.04]">
                    <Link
                        href="/integrations"
                        className="px-5 py-2 rounded-xl text-[11px] font-medium text-white/40 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60 transition-all"
                    >
                        Configurar Integrações
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2 rounded-xl text-[11px] font-medium text-white/40 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60 transition-all"
                    >
                        Voltar ao Dashboard
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
