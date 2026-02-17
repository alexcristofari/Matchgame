'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { usersApi, profilesApi, integrationsApi } from '@/services/api';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

interface IntegrationStatus {
    connected: boolean;
    externalId?: string;
    syncedAt?: string;
    favoritesCount?: number;
    genresCount?: number;
}

interface IntegrationsState {
    steam: IntegrationStatus;
    spotify: IntegrationStatus;
    anime: IntegrationStatus;
    movie: IntegrationStatus;
    books: IntegrationStatus;
}

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, logout, setUser } = useAuthStore();
    const [profile, setProfile] = useState<{ bio?: string; lookingFor?: string; location?: string; photos?: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [integrations, setIntegrations] = useState<IntegrationsState>({
        steam: { connected: false },
        spotify: { connected: false },
        anime: { connected: false },
        movie: { connected: false },
        books: { connected: false }
    });
    const [matchesCount, setMatchesCount] = useState(0);
    const [likesReceivedCount, setLikesReceivedCount] = useState(0);

    // Connect & Feedback State
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [connecting, setConnecting] = useState(false);

    // Modals State
    const [showSteamModal, setShowSteamModal] = useState(false);
    const [showMusicModal, setShowMusicModal] = useState(false);
    const [showGamesModal, setShowGamesModal] = useState(false);
    const [showAnimeModal, setShowAnimeModal] = useState(false);
    const [showMovieModal, setShowMovieModal] = useState(false);

    // Steam State
    const [steamId, setSteamId] = useState('');

    // Music State
    const [musicData, setMusicData] = useState({ profileUrl: '', genres: [] as string[], topSongs: [] as any[] });
    const [trackSearchQuery, setTrackSearchQuery] = useState('');
    const [trackSearchResults, setTrackSearchResults] = useState<any[]>([]);
    const [isSearchingTracks, setIsSearchingTracks] = useState(false);
    const availableGenres = ['Rock', 'Pop', 'Indie', 'Metal', 'Hip Hop', 'Jazz', 'Electronic', 'Classical'];

    // Games State
    const [searchQuery, setSearchQuery] = useState('');
    const [gamesLoading, setGamesLoading] = useState(false);
    const [filteredGames, setFilteredGames] = useState<any[]>([]);
    const [selectedFavorites, setSelectedFavorites] = useState<any[]>([]);

    // Anime State
    const [animeData, setAnimeData] = useState({ profileUrl: '', genres: [] as string[], favorites: [] as any[] });
    const [animeSearchQuery, setAnimeSearchQuery] = useState('');
    const [animeSearchResults, setAnimeSearchResults] = useState<any[]>([]);
    const [isSearchingAnime, setIsSearchingAnime] = useState(false);
    const availableAnimeGenres = ['Shonen', 'Seinen', 'Shojo', 'Mecha', 'Slice of Life', 'Horror', 'Sports'];

    // Movie State
    const [movieData, setMovieData] = useState({ profileUrl: '', genres: [] as string[], favorites: [] as any[] });
    const [movieSearchQuery, setMovieSearchQuery] = useState('');
    const [movieSearchResults, setMovieSearchResults] = useState<any[]>([]);
    const [isSearchingMovie, setIsSearchingMovie] = useState(false);
    const availableMovieGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'];

    // --- Handlers Implementation ---

    const handleConnectSteam = async () => {
        try {
            setConnecting(true);
            setError('');
            await integrationsApi.connectSteam(steamId);
            setSuccess('Steam conectado com sucesso!');
            setShowSteamModal(false);
            setIntegrations(prev => ({ ...prev, steam: { ...prev.steam, connected: true } }));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao conectar Steam');
        } finally {
            setConnecting(false);
        }
    };

    const handleSaveFavorites = async () => {
        try {
            setConnecting(true);
            await integrationsApi.saveFavoriteGames(selectedFavorites);
            setSuccess('Jogos favoritos salvos!');
            setShowGamesModal(false);
        } catch (err: any) {
            setError('Erro ao salvar jogos');
        } finally {
            setConnecting(false);
        }
    };

    const handleSaveMusic = async () => {
        try {
            setConnecting(true);
            await integrationsApi.saveSpotifyManual({
                profileUrl: musicData.profileUrl,
                genres: musicData.genres,
                topSongs: musicData.topSongs
            });
            setSuccess('Perfil musical salvo!');
            setShowMusicModal(false);
        } catch (err) {
            setError('Erro ao salvar música');
        } finally {
            setConnecting(false);
        }
    };

    const handleSaveAnime = async () => {
        try {
            setConnecting(true);
            await integrationsApi.saveAnimeManual({
                genres: animeData.genres,
                favorites: animeData.favorites
            });
            setSuccess('Animes salvos!');
            setShowAnimeModal(false);
        } catch (err) {
            setError('Erro ao salvar animes');
        } finally {
            setConnecting(false);
        }
    };

    const handleSaveMovie = async () => {
        try {
            setConnecting(true);
            await integrationsApi.saveMovieManual({
                genres: movieData.genres,
                favorites: movieData.favorites
            });
            setSuccess('Filmes salvos!');
            setShowMovieModal(false);
        } catch (err) {
            setError('Erro ao salvar filmes');
        } finally {
            setConnecting(false);
        }
    };

    const handleLogout = logout;

    const handleIntegrationClick = async (name: string) => {
        if (name === 'Steam') {
            handleOpenGamesModal();
        }
        if (name === 'Spotify') {
            setShowMusicModal(true);
            try {
                const res = await integrationsApi.getSpotify();
                if (res.data) {
                    setMusicData({
                        profileUrl: res.data.profileUrl || '',
                        genres: res.data.genres || [],
                        topSongs: res.data.topSongs || []
                    });
                }
            } catch (e) {
                console.error('Failed to load Spotify data', e);
            }
        }
        if (name === 'MyAnimeList') {
            setShowAnimeModal(true);
            try {
                const res = await integrationsApi.getAnime();
                if (res.data) {
                    setAnimeData({
                        profileUrl: res.data.profileUrl || '',
                        genres: res.data.genres || [],
                        favorites: res.data.favorites || []
                    });
                }
            } catch (e) {
                console.error('Failed to load Anime data', e);
            }
        }
        if (name === 'TMDB') {
            setShowMovieModal(true);
            try {
                const res = await integrationsApi.getMovie();
                if (res.data) {
                    setMovieData({
                        profileUrl: res.data.profileUrl || '',
                        genres: res.data.genres || [],
                        favorites: res.data.favorites || []
                    });
                }
            } catch (e) {
                console.error('Failed to load Movie data', e);
            }
        }
    };

    // --- Helper Handlers ---

    // Games
    const handleOpenGamesModal = async () => {
        setShowGamesModal(true);
        try {
            const res = await integrationsApi.getFavoriteGames();
            // Expected format: { games: [], favorites: [] } or just favorites array depending on API
            // Let's check integrationsApi.getFavoriteGames implementation in api.ts
            // It calls /favorites/games. 
            // The backend endpoint GET /favorites/games (we need to check this endpoint if it exists, otherwise use steam/games)

            // Actually, let's use the Steam integration data first if available
            // But we want the "Manual" favorites if we are supporting that. 
            // For now, let's assume getSteamGames gives us the selection pool + favorites.

            // Wait, looking at api.ts: getFavoriteGames calls /favorites/games
            // Looking at backend... I don't see favoritesRouter in my file view, only integrationsRouter.
            // Let's assume for now we use the steam endpoint for existing favorites if the favorites endpoint logic is similar.

            // Correction: The user wants to manually select favorites from a list.
            // Let's try to fetch what we have.

            const resSteam = await integrationsApi.getSteamGames();
            if (resSteam.data && resSteam.data.favorites) {
                setSelectedFavorites(resSteam.data.favorites);
            }
        } catch (e) {
            console.error('Failed to load games', e);
        }
    };

    // Games Helper
    const toggleGameSelection = (game: any) => {
        if (selectedFavorites.some(f => f.appid === game.appid)) {
            setSelectedFavorites(prev => prev.filter(f => f.appid !== game.appid));
        } else {
            if (selectedFavorites.length >= 5) return;
            setSelectedFavorites(prev => [...prev, game]);
        }
    };

    // Music
    const toggleGenre = (genre: string) => {
        if (musicData.genres.includes(genre)) {
            setMusicData(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
        } else {
            if (musicData.genres.length >= 3) return;
            setMusicData(prev => ({ ...prev, genres: [...prev.genres, genre] }));
        }
    };
    const addTrack = (track: any) => {
        if (musicData.topSongs.length >= 5) return;
        setMusicData(prev => ({ ...prev, topSongs: [...prev.topSongs, track] }));
        setTrackSearchResults([]);
        setTrackSearchQuery('');
    };
    const removeMusicItem = (type: string, index: number) => {
        if (type === 'topSongs') {
            setMusicData(prev => ({ ...prev, topSongs: prev.topSongs.filter((_, i) => i !== index) }));
        }
    };

    // Anime
    const toggleAnimeGenre = (genre: string) => {
        if (animeData.genres.includes(genre)) {
            setAnimeData(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
        } else {
            if (animeData.genres.length >= 3) return;
            setAnimeData(prev => ({ ...prev, genres: [...prev.genres, genre] }));
        }
    };
    const addAnime = (anime: any) => {
        if (animeData.favorites.length >= 5) return;
        setAnimeData(prev => ({ ...prev, favorites: [...prev.favorites, anime] }));
        setAnimeSearchResults([]);
        setAnimeSearchQuery('');
    };
    const removeAnimeItem = (type: string, index: number) => {
        if (type === 'favorites') {
            setAnimeData(prev => ({ ...prev, favorites: prev.favorites.filter((_, i) => i !== index) }));
        }
    };

    // Movie
    const toggleMovieGenre = (genre: string) => {
        if (movieData.genres.includes(genre)) {
            setMovieData(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
        } else {
            if (movieData.genres.length >= 3) return;
            setMovieData(prev => ({ ...prev, genres: [...prev.genres, genre] }));
        }
    };
    const addMovie = (movie: any) => {
        if (movieData.favorites.length >= 5) return;
        setMovieData(prev => ({ ...prev, favorites: [...prev.favorites, movie] }));
        setMovieSearchResults([]);
        setMovieSearchQuery('');
    };
    const removeMovieItem = (type: string, index: number) => {
        if (type === 'favorites') {
            setMovieData(prev => ({ ...prev, favorites: prev.favorites.filter((_, i) => i !== index) }));
        }
    };

    // Music Helper for input
    const handleMusicChange = (field: string, value: any) => {
        setMusicData(prev => ({ ...prev, [field]: value }));
    };


    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user) return;

            try {
                // Load profile
                try {
                    const profileRes = await profilesApi.getMyProfile();
                    if (profileRes.success) {
                        setProfile(profileRes.data);
                    }
                } catch (error) {
                    console.error('Failed to load profile:', error);
                }

                // Load all integrations in parallel to determine real connectivity
                const [steamRes, spotifyRes, animeRes, movieRes, booksRes] = await Promise.all([
                    integrationsApi.getSteam().catch(() => ({ success: false, data: null })),
                    integrationsApi.getSpotify().catch(() => ({ success: false, data: null })),
                    integrationsApi.getAnime().catch(() => ({ success: false, data: null })),
                    integrationsApi.getMovie().catch(() => ({ success: false, data: null })),
                    integrationsApi.getBooks().catch(() => ({ success: false, data: null }))
                ]);

                const steamData = steamRes.data || {};
                const spotifyData = spotifyRes.data || {};
                const animeData = animeRes.data || {};
                const movieData = movieRes.data || {};
                const booksDataRes = booksRes.data || {};

                setIntegrations({
                    steam: {
                        connected: !!steamData.connected,
                        favoritesCount: (steamData.favoriteGames || []).length,
                        genresCount: (steamData.genres || []).length
                    },
                    spotify: {
                        connected: !!spotifyData.connected,
                        favoritesCount: (spotifyData.topSongs || spotifyData.topArtists || []).length,
                        genresCount: (spotifyData.genres || []).length
                    },
                    anime: {
                        connected: !!animeData.connected,
                        favoritesCount: (animeData.favorites || []).length,
                        genresCount: (animeData.genres || []).length
                    },
                    movie: {
                        connected: !!movieData.connected,
                        favoritesCount: (movieData.favorites || []).length,
                        genresCount: (movieData.genres || []).length
                    },
                    books: {
                        connected: !!booksDataRes.connected,
                        favoritesCount: (booksDataRes.favorites || []).length,
                        genresCount: (booksDataRes.genres || []).length
                    }
                });
            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user]);

    // --- Search Effects ---

    // 1. Games Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setGamesLoading(true);
                try {
                    const res = await integrationsApi.searchGames(searchQuery);
                    setFilteredGames(res.data || []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setGamesLoading(false);
                }
            } else {
                setFilteredGames([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Music Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (trackSearchQuery.length > 2) {
                setIsSearchingTracks(true);
                try {
                    const res = await integrationsApi.searchSpotifyTracks(trackSearchQuery);
                    setTrackSearchResults(res.data || []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingTracks(false);
                }
            } else {
                setTrackSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [trackSearchQuery]);

    // 3. Anime Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (animeSearchQuery.length > 2) {
                setIsSearchingAnime(true);
                try {
                    const res = await integrationsApi.searchAnime(animeSearchQuery);
                    setAnimeSearchResults(res.data || []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingAnime(false);
                }
            } else {
                setAnimeSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [animeSearchQuery]);

    // 4. Movie Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (movieSearchQuery.length > 2) {
                setIsSearchingMovie(true);
                try {
                    const res = await integrationsApi.searchMovies(movieSearchQuery);
                    setMovieSearchResults(res.data || []);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingMovie(false);
                }
            } else {
                setMovieSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [movieSearchQuery]);

    const getIntegrationCount = () => {
        let count = 0;
        if (integrations.steam?.connected) count++;
        if (integrations.spotify?.connected) count++;
        if (integrations.anime?.connected) count++;
        if (integrations.movie?.connected) count++;
        if (integrations.books?.connected) count++;
        return count;
    };

    // Calculate REAL profile progress based on 8 criteria
    const getProfileProgress = () => {
        const checks = [
            { label: 'Jogos (Steam)', done: !!integrations.steam?.connected },
            { label: 'Música (Spotify)', done: !!integrations.spotify?.connected },
            { label: 'Animes (MAL)', done: !!integrations.anime?.connected },
            { label: 'Filmes (TMDB)', done: !!integrations.movie?.connected },
            { label: 'Livros', done: !!integrations.books?.connected },
            { label: 'Bio', done: !!profile?.bio },
            { label: 'Localização', done: !!profile?.location },
            { label: 'Foto de Perfil', done: !!(profile?.photos && profile.photos.length > 0) },
        ];
        const done = checks.filter(c => c.done).length;
        return { checks, done, total: checks.length, pct: Math.round((done / checks.length) * 100) };
    };

    const getTotalFavorites = () => {
        return (integrations.steam?.favoritesCount || 0)
            + (integrations.spotify?.favoritesCount || 0)
            + (integrations.anime?.favoritesCount || 0)
            + (integrations.movie?.favoritesCount || 0)
            + (integrations.books?.favoritesCount || 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-6 h-6" />
            </div>
        );
    }

    if (!isAuthenticated || !user) return null;

    const integrationItems = [
        { icon: '🎮', name: 'Steam', desc: 'Biblioteca de Jogos', connected: integrations.steam?.connected, favs: integrations.steam?.favoritesCount || 0 },
        { icon: '🎵', name: 'Spotify', desc: 'Artistas e Músicas', connected: integrations.spotify?.connected, favs: integrations.spotify?.favoritesCount || 0 },
        { icon: '📺', name: 'MyAnimeList', desc: 'Animes Favoritos', connected: integrations.anime?.connected, favs: integrations.anime?.favoritesCount || 0 },
        { icon: '🎬', name: 'TMDB', desc: 'Filmes e Séries', connected: integrations.movie?.connected, favs: integrations.movie?.favoritesCount || 0 },
        { icon: '📚', name: 'Books', desc: 'Livros Favoritos', connected: integrations.books?.connected, favs: integrations.books?.favoritesCount || 0 },
    ];

    const progress = getProfileProgress();

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Geometric elements */}
            <div className="geo-circle w-[400px] h-[400px] -right-48 -top-48 opacity-50" />
            <div className="geo-circle-outline w-24 h-24 left-20 bottom-1/4" />

            {/* Success/Error Messages */}
            <AnimatePresence>
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg ${error ? 'bg-red-500/20 border border-red-500 text-red-300' : 'bg-green-500/20 border border-green-500 text-green-300'}`}
                    >
                        {error || success}
                        <button onClick={() => { setError(''); setSuccess(''); }} className="ml-4 opacity-50 hover:opacity-100">×</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Steam Modal */}
            <AnimatePresence>
                {showSteamModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                        onClick={() => setShowSteamModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 w-full max-w-md mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">🎮 Conectar Steam</h2>
                            <p className="text-sm text-gray-400 mb-4">
                                Digite seu Steam ID de 64 bits (17 dígitos).<br />
                                <a href="https://steamdb.info/calculator/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    Encontre seu SteamID64 aqui
                                </a>
                            </p>
                            <input
                                type="text"
                                placeholder="76561198012345678"
                                value={steamId}
                                onChange={e => setSteamId(e.target.value.replace(/\D/g, ''))}
                                className="input w-full mb-4"
                                maxLength={17}
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSteamModal(false)}
                                    className="btn-secondary flex-1"
                                    disabled={connecting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConnectSteam}
                                    className="btn-primary flex-1"
                                    disabled={connecting || steamId.length !== 17}
                                >
                                    {connecting ? 'Conectando...' : 'Conectar'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Games Selection Modal */}
            {/* Music Manual Modal */}
            <AnimatePresence>
                {showMusicModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowMusicModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">🎵 Seu Perfil Musical</h2>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {/* Profile Link */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Link do seu Perfil Spotify (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="https://open.spotify.com/user/..."
                                        value={musicData.profileUrl}
                                        onChange={e => handleMusicChange('profileUrl', e.target.value)}
                                        className="input w-full"
                                    />
                                </div>

                                {/* Genres Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Gêneros Favoritos (Max 3)</label>
                                        <span className="text-xs text-gray-500">{musicData.genres.length}/3</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                        {availableGenres.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => toggleGenre(genre)}
                                                disabled={!musicData.genres.includes(genre) && musicData.genres.length >= 3}
                                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${musicData.genres.includes(genre)
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Songs Search & List */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Músicas Favoritas (Max 5)</label>
                                        <span className="text-xs text-gray-500">{musicData.topSongs.length}/5</span>
                                    </div>

                                    {/* Selected Songs */}
                                    <div className="space-y-2 mb-4">
                                        {musicData.topSongs.map((song, index) => (
                                            <div key={index} className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                                {song.imageUrl ? (
                                                    <img src={song.imageUrl} alt={song.name} className="w-10 h-10 rounded object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                                                        🎵
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{song.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                                </div>
                                                <button onClick={() => removeMusicItem('topSongs', index)} className="text-red-400 hover:text-red-300 p-1">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Search Input */}
                                    {musicData.topSongs.length < 5 && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Buscar música no Spotify..."
                                                value={trackSearchQuery}
                                                onChange={e => setTrackSearchQuery(e.target.value)}
                                                className="input w-full pl-10"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

                                            {/* Results Dropdown */}
                                            {(trackSearchResults.length > 0 || isSearchingTracks) && (
                                                <div className="absolute bottom-full left-0 w-full mb-2 bg-[#252525] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                                                    {isSearchingTracks && <div className="p-3 text-center text-gray-500 text-sm">Buscando...</div>}
                                                    {trackSearchResults.map(track => (
                                                        <button
                                                            key={track.id}
                                                            onClick={() => addTrack(track)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                                                        >
                                                            {track.imageUrl && (
                                                                <img src={track.imageUrl} alt={track.album} className="w-10 h-10 rounded object-cover" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{track.name}</p>
                                                                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                                                            </div>
                                                            <span className="text-blue-400 text-xs">+ Add</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-[#333]">
                                <button onClick={() => setShowMusicModal(false)} className="btn-secondary flex-1" disabled={connecting}>Cancelar</button>
                                <button onClick={handleSaveMusic} className="btn-primary flex-1" disabled={connecting}>{connecting ? 'Salvando...' : 'Salvar Perfil Musical'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGamesModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowGamesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 w-full max-w-2xl max-h-[80vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">🎮 Seus Jogos Favoritos</h2>
                                <div className="flex items-center gap-4">
                                    {!integrations.steam?.connected && (
                                        <button
                                            onClick={() => setShowSteamModal(true)}
                                            className="text-xs bg-[#171a21] hover:bg-[#2a475e] text-white px-3 py-1.5 rounded flex items-center gap-2 transition-colors border border-white/10"
                                        >
                                            <img src="/steam-icon.svg" alt="Steam" className="w-4 h-4" onError={(e) => e.currentTarget.style.display = 'none'} />
                                            <span>Conectar Steam</span>
                                        </button>
                                    )}
                                    <span className="text-sm text-gray-400">
                                        {selectedFavorites.length}/5 selecionados
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 mb-4">
                                Selecione até 5 jogos para mostrar no seu perfil.
                                {!integrations.steam?.connected && " Conecte sua Steam para ver sua biblioteca ou busque manualmente abaixo."}
                            </p>

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Buscar jogos..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="input w-full mb-4"
                            />

                            {/* Games Grid */}
                            <div className="flex-1 overflow-y-auto mb-4 min-h-[300px]">
                                {gamesLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="spinner w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {filteredGames.slice(0, 50).map(game => (
                                            <button
                                                key={game.appid}
                                                onClick={() => toggleGameSelection(game)}
                                                className={`p-3 rounded-lg text-left transition-all ${selectedFavorites.some(f => f.appid === game.appid)
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-white/20'
                                                    : 'bg-[#1a1a1a] hover:bg-[#252525] border border-[#333]'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {game.iconUrl && (
                                                        <img
                                                            src={game.iconUrl}
                                                            alt=""
                                                            className="w-8 h-8 rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{game.name}</p>
                                                        <p className="text-xs text-gray-400">{game.playtimeHours}h jogadas</p>
                                                    </div>
                                                    {selectedFavorites.some(f => f.appid === game.appid) && (
                                                        <span className="text-lg">✓</span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Games Preview */}
                            {selectedFavorites.length > 0 && (
                                <div className="mb-4 p-3 bg-[#1a1a1a] rounded-lg">
                                    <p className="text-xs text-gray-400 mb-2">Selecionados:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFavorites.map(game => (
                                            <span key={game.appid} className="text-xs bg-[#333] px-2 py-1 rounded flex items-center gap-1">
                                                {game.name}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleGameSelection(game); }}
                                                    className="ml-1 hover:text-red-400"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowGamesModal(false)}
                                    className="btn-secondary flex-1"
                                    disabled={connecting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveFavorites}
                                    className="btn-primary flex-1"
                                    disabled={connecting || selectedFavorites.length === 0}
                                >
                                    {connecting ? 'Salvando...' : `Salvar ${selectedFavorites.length} favoritos`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Anime Modal */}
            <AnimatePresence>
                {showAnimeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAnimeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">📺 Seus Animes Favoritos</h2>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {/* Profile Link */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Link do seu Perfil MyAnimeList (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="https://myanimelist.net/profile/..."
                                        value={animeData.profileUrl}
                                        onChange={e => setAnimeData(prev => ({ ...prev, profileUrl: e.target.value }))}
                                        className="input w-full"
                                    />
                                </div>

                                {/* Genres Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Gêneros de Anime (Max 3)</label>
                                        <span className="text-xs text-gray-500">{animeData.genres.length}/3</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                        {availableAnimeGenres.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => toggleAnimeGenre(genre)}
                                                disabled={!animeData.genres.includes(genre) && animeData.genres.length >= 3}
                                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${animeData.genres.includes(genre)
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Anime Search & List */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Top 5 Animes</label>
                                        <span className="text-xs text-gray-500">{animeData.favorites.length}/5</span>
                                    </div>

                                    {/* Selected Animes */}
                                    <div className="space-y-2 mb-4">
                                        {animeData.favorites.map((anime, index) => (
                                            <div key={index} className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                                {anime.imageUrl ? (
                                                    <img src={anime.imageUrl} alt={anime.title} className="w-10 h-14 rounded object-cover" />
                                                ) : (
                                                    <div className="w-10 h-14 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                                                        📺
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{anime.title}</p>
                                                </div>
                                                <button onClick={() => removeAnimeItem('favorites', index)} className="text-red-400 hover:text-red-300 p-1">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Search Input */}
                                    {animeData.favorites.length < 5 && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Buscar anime (Naruto, One Piece...)"
                                                value={animeSearchQuery}
                                                onChange={e => setAnimeSearchQuery(e.target.value)}
                                                className="input w-full pl-10"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

                                            {/* Results Dropdown */}
                                            {(animeSearchResults.length > 0 || isSearchingAnime) && (
                                                <div className="absolute bottom-full left-0 w-full mb-2 bg-[#252525] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                                                    {isSearchingAnime && <div className="p-3 text-center text-gray-500 text-sm">Buscando...</div>}
                                                    {animeSearchResults.map((anime, index) => (
                                                        <button
                                                            key={`${anime.id}-${index}`}
                                                            onClick={() => addAnime(anime)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                                                        >
                                                            {anime.imageUrl && (
                                                                <img src={anime.imageUrl} alt={anime.title} className="w-8 h-12 rounded object-cover" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{anime.title}</p>
                                                                <p className="text-xs text-gray-400 truncate">{anime.year}</p>
                                                            </div>
                                                            <span className="text-blue-400 text-xs">+ Add</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-[#333]">
                                <button onClick={() => setShowAnimeModal(false)} className="btn-secondary flex-1" disabled={connecting}>Cancelar</button>
                                <button onClick={handleSaveAnime} className="btn-primary flex-1" disabled={connecting}>{connecting ? 'Salvando...' : 'Salvar Animes'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Movie Modal */}
            <AnimatePresence>
                {showMovieModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowMovieModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card p-6 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4">🎬 Seus Filmes Favoritos</h2>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {/* Profile Link */}
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Link do seu Perfil TMDB / Letterboxd (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="https://www.themoviedb.org/u/..."
                                        value={movieData.profileUrl}
                                        onChange={e => setMovieData(prev => ({ ...prev, profileUrl: e.target.value }))}
                                        className="input w-full"
                                    />
                                </div>

                                {/* Genres Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Gêneros de Filmes (Max 3)</label>
                                        <span className="text-xs text-gray-500">{movieData.genres.length}/3</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                        {availableMovieGenres.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => toggleMovieGenre(genre)}
                                                disabled={!movieData.genres.includes(genre) && movieData.genres.length >= 3}
                                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${movieData.genres.includes(genre)
                                                    ? 'bg-red-500 border-red-500 text-white'
                                                    : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Movie Search & List */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm text-gray-400">Top 5 Filmes</label>
                                        <span className="text-xs text-gray-500">{movieData.favorites.length}/5</span>
                                    </div>

                                    {/* Selected Movies */}
                                    <div className="space-y-2 mb-4">
                                        {movieData.favorites.map((movie, index) => (
                                            <div key={index} className="flex items-center gap-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                                                {movie.imageUrl ? (
                                                    <img src={movie.imageUrl} alt={movie.title} className="w-10 h-14 rounded object-cover" />
                                                ) : (
                                                    <div className="w-10 h-14 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                                                        🎬
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{movie.title}</p>
                                                </div>
                                                <button onClick={() => removeMovieItem('favorites', index)} className="text-red-400 hover:text-red-300 p-1">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Search Input */}
                                    {movieData.favorites.length < 5 && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Buscar filme (Matrix, Inception...)"
                                                value={movieSearchQuery}
                                                onChange={e => setMovieSearchQuery(e.target.value)}
                                                className="input w-full pl-10"
                                            />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>

                                            {/* Results Dropdown */}
                                            {(movieSearchResults.length > 0 || isSearchingMovie) && (
                                                <div className="absolute bottom-full left-0 w-full mb-2 bg-[#252525] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto z-10">
                                                    {isSearchingMovie && <div className="p-3 text-center text-gray-500 text-sm">Buscando...</div>}
                                                    {movieSearchResults.map(movie => (
                                                        <button
                                                            key={movie.id}
                                                            onClick={() => addMovie(movie)}
                                                            className="w-full flex items-center gap-3 p-2 hover:bg-white/5 text-left border-b border-white/5 last:border-0"
                                                        >
                                                            {movie.imageUrl && (
                                                                <img src={movie.imageUrl} alt={movie.title} className="w-8 h-12 rounded object-cover" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{movie.title}</p>
                                                                <p className="text-xs text-gray-400 truncate">{movie.year}</p>
                                                            </div>
                                                            <span className="text-blue-400 text-xs">+ Add</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-[#333]">
                                <button onClick={() => setShowMovieModal(false)} className="btn-secondary flex-1" disabled={connecting}>Cancelar</button>
                                <button onClick={handleSaveMovie} className="btn-primary flex-1" disabled={connecting}>{connecting ? 'Salvando...' : 'Salvar Filmes'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    <Link href="/integrations" className="nav-link">Integrations</Link>
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
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-xl font-bold overflow-hidden">
                                {profile?.photos && profile.photos.length > 0 ? (
                                    <img src={profile.photos[0]} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        {!profile ? (
                            <Link href="/onboarding" className="btn-primary w-full justify-center text-xs">
                                ⚠️ Complete seu Perfil para aparecer no Discovery
                            </Link>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowEditProfileModal(true)}
                                    className="btn-secondary flex-1 justify-center text-xs py-2"
                                >
                                    Editar Perfil
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Stats Card */}
                    <motion.div
                        className="card p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="section-title mb-6">Suas Estatísticas</p>

                        <div className="space-y-0">
                            <div className="flex items-center justify-between py-3 border-b border-[#252525]">
                                <span className="text-sm text-gray-500">Integrações</span>
                                <span className={`font-semibold ${getIntegrationCount() === 5 ? 'text-green-400' : 'text-white'}`}>{getIntegrationCount()} / 5</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-[#252525]">
                                <span className="text-sm text-gray-500">Total Favoritos</span>
                                <span className="font-semibold">{getTotalFavorites()} / 25</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-[#252525]">
                                <span className="text-sm text-gray-500">Matches</span>
                                <span className="font-semibold">{matchesCount}</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm text-gray-500">Likes Recebidos</span>
                                <span className="font-semibold">{likesReceivedCount}</span>
                            </div>
                        </div>

                        {/* Mini integration badges */}
                        <div className="mt-4 pt-4 border-t border-[#252525]">
                            <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">Integrações</p>
                            <div className="grid grid-cols-5 gap-1.5">
                                {integrationItems.map(item => (
                                    <div
                                        key={item.name}
                                        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-center transition-colors ${item.connected
                                            ? 'bg-green-500/10 border border-green-500/20'
                                            : 'bg-white/[0.02] border border-white/[0.04]'
                                            }`}
                                    >
                                        <span className="text-base">{item.icon}</span>
                                        <span className={`text-[9px] font-medium ${item.connected ? 'text-green-400' : 'text-gray-600'}`}>
                                            {item.connected ? `${item.favs}/5` : '—'}
                                        </span>
                                    </div>
                                ))}
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
                        <p className="section-title mb-4">Progresso do Perfil</p>

                        <div className="flex items-center justify-center py-4">
                            <div className="relative w-24 h-24">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" r="42" fill="none" stroke="#252525" strokeWidth="7" />
                                    <circle
                                        cx="48" cy="48" r="42" fill="none"
                                        stroke={progress.pct === 100 ? '#22c55e' : progress.pct >= 50 ? '#eab308' : '#ef4444'}
                                        strokeWidth="7"
                                        strokeDasharray={2 * Math.PI * 42}
                                        strokeDashoffset={2 * Math.PI * 42 - (progress.pct / 100) * 2 * Math.PI * 42}
                                        strokeLinecap="round"
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold">{progress.pct}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="space-y-1.5 mt-2">
                            {progress.checks.map((c, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${c.done ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.04] text-gray-600'
                                        }`}>
                                        {c.done ? '✓' : '○'}
                                    </span>
                                    <span className={c.done ? 'text-gray-400' : 'text-gray-600'}>{c.label}</span>
                                </div>
                            ))}
                        </div>

                        {progress.pct < 100 && (
                            <Link href="/integrations" className="mt-4 block text-center text-xs text-yellow-500/70 hover:text-yellow-500 transition-colors">
                                Complete seu perfil para desbloquear o matching
                            </Link>
                        )}
                        {progress.pct === 100 && (
                            <p className="mt-4 text-center text-xs text-green-400/70">✨ Perfil completo! Você está pronto para matches.</p>
                        )}
                    </motion.div>
                </div>


            </div>

            <EditProfileModal
                isOpen={showEditProfileModal}
                onClose={() => setShowEditProfileModal(false)}
                currentProfile={profile}
                onSave={async () => {
                    const res = await profilesApi.getMyProfile();
                    if (res.success) setProfile(res.data);
                }}
            />
        </main>
    );
}
