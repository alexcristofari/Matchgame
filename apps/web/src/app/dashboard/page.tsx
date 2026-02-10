'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { usersApi, profilesApi, integrationsApi } from '@/services/api';

interface IntegrationStatus {
    connected: boolean;
    externalId?: string;
    syncedAt?: string;
}

interface IntegrationsState {
    steam: IntegrationStatus;
    spotify: IntegrationStatus;
}

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, logout, setUser } = useAuthStore();
    const [profile, setProfile] = useState<{ bio?: string; lookingFor?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [integrations, setIntegrations] = useState<IntegrationsState>({
        steam: { connected: false },
        spotify: { connected: false }
    });

    // Modal states
    const [showSteamModal, setShowSteamModal] = useState(false);
    const [steamId, setSteamId] = useState('');
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Games selection modal states
    const [showGamesModal, setShowGamesModal] = useState(false);
    const [allGames, setAllGames] = useState<{ appid: number; name: string; playtimeHours: number; iconUrl: string | null }[]>([]);
    const [selectedFavorites, setSelectedFavorites] = useState<{ appid: number; name: string; iconUrl?: string }[]>([]);
    const [gamesLoading, setGamesLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Music manual modal states
    const [showMusicModal, setShowMusicModal] = useState(false);
    const [musicData, setMusicData] = useState({
        profileUrl: '',
        playlists: [] as string[],
        genres: [] as string[],
        topSongs: [] as { name: string; artist: string; url: string; imageUrl?: string }[]
    });

    // New Music UI State
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);
    const [trackSearchQuery, setTrackSearchQuery] = useState('');
    const [trackSearchResults, setTrackSearchResults] = useState<any[]>([]);
    const [isSearchingTracks, setIsSearchingTracks] = useState(false);

    // Anime Modal State
    const [showAnimeModal, setShowAnimeModal] = useState(false);
    const [animeData, setAnimeData] = useState({
        genres: [] as string[],
        favorites: [] as { id: number; title: string; imageUrl: string }[]
    });
    const [availableAnimeGenres, setAvailableAnimeGenres] = useState<string[]>([]);
    const [animeSearchQuery, setAnimeSearchQuery] = useState('');
    const [animeSearchResults, setAnimeSearchResults] = useState<any[]>([]);
    const [isSearchingAnime, setIsSearchingAnime] = useState(false);

    // Movie Modal State
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [movieData, setMovieData] = useState({
        genres: [] as string[],
        favorites: [] as { id: number; title: string; imageUrl: string }[]
    });
    const [availableMovieGenres, setAvailableMovieGenres] = useState<string[]>([]);
    const [movieSearchQuery, setMovieSearchQuery] = useState('');
    const [movieSearchResults, setMovieSearchResults] = useState<any[]>([]);
    const [isSearchingMovie, setIsSearchingMovie] = useState(false);

    // Music Handlers
    const handleMusicChange = (field: string, value: any, index?: number, subField?: string) => {
        setMusicData(prev => {
            const newData = { ...prev };
            if (field === 'playlists' || field === 'genres') {
                const list = [...(newData[field as keyof typeof newData] as string[])];
                if (index !== undefined) list[index] = value;
                (newData as any)[field] = list;
            } else if (field === 'topSongs' && index !== undefined && subField) {
                const list = [...newData.topSongs];
                list[index] = { ...list[index], [subField]: value };
                newData.topSongs = list;
            } else {
                (newData as any)[field] = value;
            }
            return newData;
        });
    };

    const addMusicItem = (field: 'playlists' | 'genres' | 'topSongs') => {
        setMusicData(prev => {
            const newData = { ...prev };
            if (field === 'playlists' && prev.playlists.length < 3) {
                newData.playlists = [...prev.playlists, ''];
            } else if (field === 'genres' && prev.genres.length < 3) {
                newData.genres = [...prev.genres, ''];
            } else if (field === 'topSongs' && prev.topSongs.length < 5) {
                newData.topSongs = [...prev.topSongs, { name: '', artist: '', url: '' }];
            }
            return newData;
        });
    };

    const removeMusicItem = (field: 'playlists' | 'genres' | 'topSongs', index: number) => {
        setMusicData(prev => {
            const newData = { ...prev };
            if (field === 'playlists') {
                newData.playlists = prev.playlists.filter((_, i) => i !== index);
            } else if (field === 'genres') {
                newData.genres = prev.genres.filter((_, i) => i !== index);
            } else if (field === 'topSongs') {
                newData.topSongs = prev.topSongs.filter((_, i) => i !== index);
            }
            return newData;
        });
    };

    // Fetch genres
    useEffect(() => {
        if (showMusicModal && availableGenres.length === 0) {
            integrationsApi.getSpotifyGenres().then(res => {
                if (res.success) setAvailableGenres(res.data);
            });
        }
    }, [showMusicModal]);

    // Search tracks Debounce
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (trackSearchQuery.trim().length > 2) {
                setIsSearchingTracks(true);
                try {
                    const res = await integrationsApi.searchSpotifyTracks(trackSearchQuery);
                    if (res.success) setTrackSearchResults(res.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingTracks(false);
                }
            } else {
                setTrackSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [trackSearchQuery]);

    const toggleGenre = (genre: string) => {
        setMusicData(prev => {
            const current = prev.genres || [];
            if (current.includes(genre)) {
                return { ...prev, genres: current.filter(g => g !== genre) };
            }
            if (current.length >= 3) return prev;
            return { ...prev, genres: [...current, genre] };
        });
    };

    const addTrack = (track: any) => {
        setMusicData(prev => {
            if (prev.topSongs.length >= 5) return prev;
            // Check if already added
            if (prev.topSongs.some(s => s.url === track.url)) return prev;

            const newSong = {
                name: track.name,
                artist: track.artist,
                url: track.url,
                imageUrl: track.imageUrl
            };
            return { ...prev, topSongs: [...prev.topSongs, newSong] };
        });
        setTrackSearchQuery('');
        setTrackSearchResults([]);
    };

    const handleSaveMusic = async () => {
        setConnecting(true);
        try {
            // Filter empty items
            const cleanData = {
                ...musicData,
                playlists: musicData.playlists.filter(p => p.trim()),
                genres: musicData.genres.filter(g => g.trim()),
                topSongs: musicData.topSongs.filter(s => s.name.trim() && s.artist.trim())
            };

            const result = await integrationsApi.saveSpotifyManual(cleanData);
            if (result.success) {
                setSuccess('Perfil de música salvo com sucesso!');
                setShowMusicModal(false);
                loadIntegrations();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar música');
        } finally {
            setConnecting(false);
        }
    };

    // Anime Handlers
    useEffect(() => {
        if (showAnimeModal && availableAnimeGenres.length === 0) {
            integrationsApi.getAnimeGenres().then(res => {
                if (res.success) setAvailableAnimeGenres(res.data);
            });
        }
    }, [showAnimeModal]);

    // Anime Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (animeSearchQuery.trim().length > 2) {
                setIsSearchingAnime(true);
                try {
                    const res = await integrationsApi.searchAnime(animeSearchQuery);
                    if (res.success) setAnimeSearchResults(res.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingAnime(false);
                }
            } else {
                setAnimeSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [animeSearchQuery]);

    const toggleAnimeGenre = (genre: string) => {
        setAnimeData(prev => {
            const current = prev.genres || [];
            if (current.includes(genre)) {
                return { ...prev, genres: current.filter(g => g !== genre) };
            }
            if (current.length >= 3) return prev;
            return { ...prev, genres: [...current, genre] };
        });
    };

    const addAnime = (anime: any) => {
        setAnimeData(prev => {
            if (prev.favorites.length >= 5) return prev;
            if (prev.favorites.some(f => f.id === anime.id)) return prev;

            return {
                ...prev,
                favorites: [...prev.favorites, {
                    id: anime.id,
                    title: anime.title,
                    imageUrl: anime.imageUrl
                }]
            };
        });
        setAnimeSearchQuery('');
        setAnimeSearchResults([]);
    };

    const removeAnimeItem = (field: 'genres' | 'favorites', index: number) => {
        setAnimeData(prev => {
            if (field === 'genres') {
                return { ...prev, genres: prev.genres.filter((_, i) => i !== index) };
            } else {
                return { ...prev, favorites: prev.favorites.filter((_, i) => i !== index) };
            }
        });
    };

    const handleSaveAnime = async () => {
        setConnecting(true);
        try {
            await integrationsApi.saveAnimeManual(animeData);
            setSuccess('Perfil de animes salvo com sucesso!');
            setShowAnimeModal(false);
            // loadIntegrations(); // Assume we might want to reload sync status if we had one
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar animes');
        } finally {
            setConnecting(false);
        }
    };

    // Movie Handlers
    useEffect(() => {
        if (showMovieModal && availableMovieGenres.length === 0) {
            integrationsApi.getMovieGenres().then(res => {
                if (res.success) setAvailableMovieGenres(res.data);
            });
        }
    }, [showMovieModal]);

    // Movie Search Debounce
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (movieSearchQuery.trim().length > 2) {
                setIsSearchingMovie(true);
                try {
                    const res = await integrationsApi.searchMovies(movieSearchQuery);
                    if (res.success) setMovieSearchResults(res.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearchingMovie(false);
                }
            } else {
                setMovieSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [movieSearchQuery]);

    const toggleMovieGenre = (genre: string) => {
        setMovieData(prev => {
            const current = prev.genres || [];
            if (current.includes(genre)) {
                return { ...prev, genres: current.filter(g => g !== genre) };
            }
            if (current.length >= 3) return prev;
            return { ...prev, genres: [...current, genre] };
        });
    };

    const addMovie = (movie: any) => {
        setMovieData(prev => {
            if (prev.favorites.length >= 5) return prev;
            if (prev.favorites.some(f => f.id === movie.id)) return prev;

            return {
                ...prev,
                favorites: [...prev.favorites, {
                    id: movie.id,
                    title: movie.title,
                    imageUrl: movie.imageUrl
                }]
            };
        });
        setMovieSearchQuery('');
        setMovieSearchResults([]);
    };

    const removeMovieItem = (field: 'genres' | 'favorites', index: number) => {
        setMovieData(prev => {
            if (field === 'genres') {
                return { ...prev, genres: prev.genres.filter((_, i) => i !== index) };
            } else {
                return { ...prev, favorites: prev.favorites.filter((_, i) => i !== index) };
            }
        });
    };

    const handleSaveMovie = async () => {
        setConnecting(true);
        try {
            await integrationsApi.saveMovieManual(movieData);
            setSuccess('Perfil de filmes salvo com sucesso!');
            setShowMovieModal(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar filmes');
        } finally {
            setConnecting(false);
        }
    };

    // ... (useEffect for spotify checked) ...

    const loadFavorites = async () => {
        try {
            const result = await integrationsApi.getFavoriteGames();
            if (result.success) {
                // Store full objects
                setSelectedFavorites(result.data.map((f: any) => ({
                    appid: Number(f.appid),
                    name: f.name,
                    iconUrl: f.iconUrl
                })));
            }
        } catch (err) {
            console.error('Error loading favorites:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) loadFavorites();
    }, [isAuthenticated]);

    // Search games effect
    useEffect(() => {
        const search = async () => {
            if (searchQuery.length > 2) {
                setGamesLoading(true);
                try {
                    const result = await integrationsApi.searchGames(searchQuery);
                    if (result.success) {
                        setAllGames(result.data);
                    }
                } catch (err) {
                    console.error('Search error:', err);
                } finally {
                    setGamesLoading(false);
                }
            } else if (integrations.steam.connected && searchQuery.length === 0) {
                loadSteamGames();
            } else if (searchQuery.length === 0) {
                setAllGames([]);
            }
        };

        const timeoutId = setTimeout(search, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, integrations.steam.connected]);

    const loadSteamGames = async () => {
        setGamesLoading(true);
        try {
            const result = await integrationsApi.getSteamGames();
            if (result.success) {
                setAllGames(result.data.games);
            }
        } catch (err: any) {
            console.error('Erro ao carregar jogos Steam:', err);
        } finally {
            setGamesLoading(false);
        }
    };

    const handleOpenGamesModal = async () => {
        setShowGamesModal(true);
        setSearchQuery('');
        if (integrations.steam.connected) {
            await loadSteamGames();
        } else {
            setAllGames([]);
        }
    };

    const toggleGameSelection = (game: { appid: number; name: string; iconUrl?: string | null }) => {
        setSelectedFavorites(prev => {
            if (prev.find(f => f.appid === game.appid)) {
                return prev.filter(f => f.appid !== game.appid);
            }
            if (prev.length >= 5) {
                setError('Você pode selecionar no máximo 5 jogos');
                return prev;
            }
            return [...prev, { appid: game.appid, name: game.name, iconUrl: game.iconUrl || undefined }];
        });
    };

    const handleSaveFavorites = async () => {
        setConnecting(true);
        setError('');
        try {
            const result = await integrationsApi.saveFavoriteGames(selectedFavorites);
            if (result.success) {
                setSuccess(`${result.data.length || selectedFavorites.length} favoritos salvos!`);
                setShowGamesModal(false);
                loadFavorites();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar favoritos');
        } finally {
            setConnecting(false);
        }
    };
    const loadIntegrations = async () => {
        try {
            const result = await integrationsApi.getStatus();
            if (result.success) {
                setIntegrations(result.data);
            }
        } catch (err) {
            console.error('Error loading integrations:', err);
        }
    };

    // Check for Spotify callback
    useEffect(() => {
        const spotifyConnected = searchParams.get('spotify_connected');
        const spotifyError = searchParams.get('spotify_error');

        if (spotifyConnected === 'true') {
            setSuccess('Spotify conectado com sucesso!');
            loadIntegrations();
            // Clear URL params
            window.history.replaceState({}, '', '/dashboard');
        } else if (spotifyError) {
            setError(`Erro ao conectar Spotify: ${spotifyError}`);
            window.history.replaceState({}, '', '/dashboard');
        }
    }, [searchParams]);

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

                    // Load integrations status
                    await loadIntegrations();
                }
            } catch { logout(); router.push('/auth/login'); }
            finally { setLoading(false); }
        };
        checkAuth();
    }, [router, setUser, logout]);

    const handleLogout = () => { logout(); router.push('/auth/login'); };

    const handleConnectSteam = async () => {
        if (!steamId || steamId.length !== 17) {
            setError('Steam ID deve ter 17 dígitos');
            return;
        }

        setConnecting(true);
        setError('');

        try {
            const result = await integrationsApi.connectSteam(steamId);
            if (result.success) {
                setSuccess(`Steam conectado! ${result.data.gameCount} jogos encontrados.`);
                setShowSteamModal(false);
                setSteamId('');
                await loadIntegrations();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao conectar Steam');
        } finally {
            setConnecting(false);
        }
    };

    const handleConnectSpotify = async () => {
        setConnecting(true);
        setError('');

        try {
            const result = await integrationsApi.getSpotifyAuthUrl();
            if (result.success && result.data.authUrl) {
                // Redirect to Spotify OAuth
                window.location.href = result.data.authUrl;
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao iniciar conexão Spotify');
            setConnecting(false);
        }
    };



    const handleIntegrationClick = (name: string) => {
        setError('');
        setSuccess('');

        if (name === 'Steam') {
            if (integrations.steam.connected) {
                handleOpenGamesModal();
            } else {
                setShowSteamModal(true);
            }
        } else if (name === 'Spotify') {
            // Pre-populate if connected
            if (integrations.spotify.connected) {
                integrationsApi.getSpotify().then(res => {
                    if (res.success && res.data) {
                        const data = res.data;
                        // Handle manual vs automatic data structure
                        const isManual = (data as any).isManual;

                        setMusicData({
                            profileUrl: isManual ? (data as any).profileUrl : data.profile?.external_urls?.spotify || '',
                            playlists: (data as any).playlists || [],
                            genres: (data as any).genres || [],
                            topSongs: ((data as any).topSongs || []).map((s: any) => ({
                                name: s.name,
                                artist: s.artist,
                                url: s.url,
                                imageUrl: s.imageUrl
                            }))
                        });
                    }
                }).catch(console.error);
            }
            setShowMusicModal(true);
            setShowMusicModal(true);
        } else if (name === 'MyAnimeList') {
            setShowAnimeModal(true);
        } else if (name === 'TMDB') {
            setShowMovieModal(true);
        } else {
            alert(`${name} em breve!`);
        }
    };

    const filteredGames = allGames.filter(game =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getIntegrationCount = () => {
        let count = 0;
        if (integrations.steam.connected) count++;
        if (integrations.spotify.connected) count++;
        return count;
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
        { icon: '🎮', name: 'Steam', desc: 'Your game library', connected: integrations.steam.connected },
        { icon: '🎵', name: 'Spotify', desc: 'Top artists & songs', connected: integrations.spotify.connected },
        { icon: '📺', name: 'MyAnimeList', desc: 'Anime watchlist', connected: false }, // Manual connection trigger
        { icon: '🎬', name: 'TMDB', desc: 'Movies & shows', connected: false },
    ];

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
                                <span className="text-sm text-gray-400">
                                    {selectedFavorites.length}/5 selecionados
                                </span>
                            </div>

                            <p className="text-sm text-gray-400 mb-4">
                                Selecione até 5 jogos para mostrar no seu perfil
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
                                                    {animeSearchResults.map(anime => (
                                                        <button
                                                            key={anime.id}
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
                                <span className="font-semibold">{getIntegrationCount()} / 5</span>
                            </div>
                            <div
                                className="flex items-center justify-between py-3 border-b border-[#252525] cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={handleOpenGamesModal}
                            >
                                <span className="text-sm text-gray-500">Favorites</span>
                                <span className="font-semibold">{selectedFavorites.length} / 5</span>
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
                                    <circle cx="56" cy="56" r="50" fill="none" stroke="white" strokeWidth="8" strokeDasharray="314" strokeDashoffset={314 - (getIntegrationCount() / 5) * 314} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold">{Math.round((getIntegrationCount() / 5) * 100)}%</span>
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
                        {integrationItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleIntegrationClick(item.name)}
                                disabled={connecting}
                                className={`card p-5 text-left transition-colors group relative ${item.connected
                                    ? 'border-green-500/50 hover:border-green-500'
                                    : 'hover:border-[#404040]'
                                    }`}
                            >
                                {item.connected && (
                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-green-500" />
                                )}
                                <span className="text-2xl mb-3 block group-hover:scale-110 transition-transform">{item.icon}</span>
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                    {item.connected ? '✓ Conectado' : item.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
