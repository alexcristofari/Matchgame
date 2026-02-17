'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuSave, LuGamepad2, LuMusic, LuClapperboard, LuMonitorPlay, LuSearch, LuX, LuPlus } from 'react-icons/lu';
import { integrationsApi } from '@/services/api';
import {
    GAME_GENRES, MUSIC_GENRES, ANIME_GENRES, MOVIE_GENRES, BOOK_GENRES,
    PLATFORMS_GAMES, PLATFORMS_MUSIC, PLATFORMS_ANIME, PLATFORMS_MOVIES, PLATFORMS_BOOKS
} from '@/constants/genres';
import { useDebounce } from '@/hooks/useDebounce';
import { LuBook } from 'react-icons/lu';

export default function IntegrationsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'games' | 'music' | 'anime' | 'movies' | 'books'>('games');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [gamesData, setGamesData] = useState({ genres: [] as string[], platformLinks: {} as any, favorites: [] as any[] });
    const [musicData, setMusicData] = useState({ genres: [] as string[], platformLinks: {} as any, favorites: [] as any[] });
    const [animeData, setAnimeData] = useState({ genres: [] as string[], platformLinks: {} as any, favorites: [] as any[] });
    const [movieData, setMovieData] = useState({ genres: [] as string[], platformLinks: {} as any, favorites: [] as any[] });
    const [booksData, setBooksData] = useState({ genres: [] as string[], platformLinks: {} as any, favorites: [] as any[] });

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load all data in parallel
            const [steamRes, spotifyRes, animeRes, movieRes, booksRes] = await Promise.all([
                integrationsApi.getSteamGames().catch(err => { console.log('Steam load err', err); return { data: {} }; }),
                integrationsApi.getSpotify().catch(err => { console.log('Spotify load err', err); return { data: {} }; }),
                integrationsApi.getAnime().catch(err => { console.log('Anime load err', err); return { data: {} }; }),
                integrationsApi.getMovie().catch(err => { console.log('Movie load err', err); return { data: {} }; }),
                integrationsApi.getBooks().catch(err => { console.log('Books load err', err); return { data: {} }; })
            ]);

            // Steam Data Manual Refresh
            const rawSteam = await integrationsApi.getSteam().catch(() => ({ data: {} }));
            const rSteam = rawSteam.data || {};

            // Prefer manually saved favorites if they exist in rawSteam (Integration.data.favoriteGames)
            // fallback to getSteamGames response
            const steamFavs = rSteam.favoriteGames || steamRes.data?.favorites || [];

            setGamesData({
                genres: rSteam.genres || [],
                platformLinks: rSteam.platformLinks || {},
                favorites: steamFavs
            });

            // Music
            const mData = spotifyRes.data || {};
            setMusicData({
                genres: mData.genres || [],
                platformLinks: mData.platformLinks || {},
                favorites: mData.topSongs || []
            });

            // Anime
            const aData = animeRes.data || {};
            setAnimeData({
                genres: aData.genres || [],
                platformLinks: aData.platformLinks || {},
                favorites: aData.favorites || []
            });

            // Movies
            const moData = movieRes.data || {};
            setMovieData({
                genres: moData.genres || [],
                platformLinks: moData.platformLinks || {},
                favorites: moData.favorites || []
            });

            // Books
            const bData = booksRes.data || {};
            setBooksData({
                genres: bData.genres || [],
                platformLinks: bData.platformLinks || {},
                favorites: bData.favorites || []
            });

        } catch (error) {
            console.error('Failed to load integrations', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save ALL tabs at once to prevent data loss when switching tabs
            const results = await Promise.allSettled([
                integrationsApi.saveSteamManual({
                    genres: gamesData.genres,
                    platformLinks: gamesData.platformLinks,
                    favorites: gamesData.favorites.map(f => ({
                        appid: f.appid,
                        name: f.name,
                        iconUrl: f.iconUrl
                    }))
                }),
                integrationsApi.saveSpotifyManual({
                    genres: musicData.genres,
                    platformLinks: musicData.platformLinks,
                    topSongs: musicData.favorites
                }),
                integrationsApi.saveAnimeManual({
                    genres: animeData.genres,
                    platformLinks: animeData.platformLinks,
                    favorites: animeData.favorites
                }),
                integrationsApi.saveMovieManual({
                    genres: movieData.genres,
                    platformLinks: movieData.platformLinks,
                    favorites: movieData.favorites
                }),
                integrationsApi.saveBooksManual({
                    genres: booksData.genres,
                    favorites: booksData.favorites
                })
            ]);

            const failed = results.filter(r => r.status === 'rejected');
            if (failed.length > 0) {
                console.error('Some saves failed:', failed);
                alert(`Salvo! (${failed.length} integração(ões) falharam)`);
            } else {
                alert('Tudo salvo com sucesso!');
            }
        } catch (error) {
            console.error('Error saving', error);
            alert('Erro ao salvar. Verifique o console.');
        } finally {
            setSaving(false);
        }
    };

    // Generic Handlers
    const toggleGenre = (genre: string, currentList: string[], setter: Function) => {
        if (currentList.includes(genre)) {
            setter((prev: any) => ({ ...prev, genres: prev.genres.filter((g: string) => g !== genre) }));
        } else {
            setter((prev: any) => ({ ...prev, genres: [...prev.genres, genre] }));
        }
    };

    const updateLink = (platformId: string, value: string, currentLinks: any, setter: Function) => {
        setter((prev: any) => ({
            ...prev,
            platformLinks: { ...prev.platformLinks, [platformId]: value }
        }));
    };

    // Debounced Search Effect
    useEffect(() => {
        if (debouncedSearchQuery) {
            handleSearch(debouncedSearchQuery);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    // Search Handlers
    const handleSearch = async (query: string) => {
        if (!query) return;
        setSearching(true);
        try {
            let res;
            if (activeTab === 'games') res = await integrationsApi.searchGames(query);
            else if (activeTab === 'music') res = await integrationsApi.searchSpotifyTracks(query);
            else if (activeTab === 'anime') res = await integrationsApi.searchAnime(query);
            else if (activeTab === 'movies') res = await integrationsApi.searchMovies(query);
            else if (activeTab === 'books') res = await integrationsApi.searchBooks(query);

            let results = res.data || [];
            // If Steam search returns object with games array
            if (activeTab === 'games' && !Array.isArray(results) && results.games) {
                results = results.games;
            }

            setSearchResults(Array.isArray(results) ? results : []);
        } catch (e) {
            console.error(e);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const addFavorite = (item: any) => {
        let newItem = { ...item };

        // Normalize Data Structures
        if (activeTab === 'games') {
            // Steam Item: { appid, name, img_icon_url }
            // We want: { appid, name, iconUrl }
            // Construct full URL for iconUrl if it's missing but we have img_icon_url
            if (!newItem.iconUrl && newItem.img_icon_url) {
                newItem.iconUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${newItem.appid}/${newItem.img_icon_url}.jpg`;
            }
        }

        const setter = activeTab === 'games' ? setGamesData :
            activeTab === 'music' ? setMusicData :
                activeTab === 'anime' ? setAnimeData :
                    activeTab === 'movies' ? setMovieData : setBooksData;

        const currentData = activeTab === 'games' ? gamesData :
            activeTab === 'music' ? musicData :
                activeTab === 'anime' ? animeData :
                    activeTab === 'movies' ? movieData : booksData;

        if (currentData.favorites.length >= 5) return alert('Máximo de 5 favoritos.');

        // Check duplicates
        const exists = currentData.favorites.some((f: any) => {
            if (activeTab === 'games') return f.appid === newItem.appid;
            if (activeTab === 'music') return f.id === newItem.id || (f.name === newItem.name && f.artist === newItem.artist);
            return f.id === newItem.id;
        });

        if (exists) return;

        setter((prev: any) => ({ ...prev, favorites: [...prev.favorites, newItem] }));

        setSearchQuery('');
        setSearchResults([]);
    };

    const removeFavorite = (index: number) => {
        const setter = activeTab === 'games' ? setGamesData :
            activeTab === 'music' ? setMusicData :
                activeTab === 'anime' ? setAnimeData :
                    activeTab === 'movies' ? setMovieData : setBooksData;

        setter((prev: any) => ({
            ...prev,
            favorites: prev.favorites.filter((_: any, i: number) => i !== index)
        }));
    };

    // --- RENDER HELPERS ---

    const getCurrentGenres = () => {
        switch (activeTab) {
            case 'games': return GAME_GENRES;
            case 'music': return MUSIC_GENRES;
            case 'anime': return ANIME_GENRES;
            case 'movies': return MOVIE_GENRES;
            case 'books': return BOOK_GENRES;
            default: return [];
        }
    };

    const getCurrentPlatforms = () => {
        switch (activeTab) {
            case 'games': return PLATFORMS_GAMES;
            case 'music': return PLATFORMS_MUSIC;
            case 'anime': return PLATFORMS_ANIME;
            case 'movies': return PLATFORMS_MOVIES;
            case 'books': return PLATFORMS_BOOKS;
            default: return [];
        }
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'games': return gamesData;
            case 'music': return musicData;
            case 'anime': return animeData;
            case 'movies': return movieData;
            case 'books': return booksData;
        }
    };

    const getCurrentSetter = () => {
        switch (activeTab) {
            case 'games': return setGamesData;
            case 'music': return setMusicData;
            case 'anime': return setAnimeData;
            case 'movies': return setMovieData;
            case 'books': return setBooksData;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard')} className="p-2 bg-[var(--bg-card)] rounded-full hover:bg-[var(--border)] transition">
                        <LuArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold">Integrações & Interesses</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition disabled:opacity-50 ${saving ? 'bg-gray-600' : 'bg-gradient-to-r from-orange-600 to-purple-600 hover:brightness-110'
                        }`}
                >
                    <LuSave size={18} />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
                    <TabButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<LuGamepad2 />} label="Jogos" />
                    <TabButton active={activeTab === 'music'} onClick={() => setActiveTab('music')} icon={<LuMusic />} label="Música" />
                    <TabButton active={activeTab === 'anime'} onClick={() => setActiveTab('anime')} icon={<LuMonitorPlay />} label="Animes" />
                    <TabButton active={activeTab === 'movies'} onClick={() => setActiveTab('movies')} icon={<LuClapperboard />} label="Filmes" />
                    <TabButton active={activeTab === 'books'} onClick={() => setActiveTab('books')} icon={<LuBook />} label="Livros" />
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8">

                    {/* Genres Section */}
                    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--text-muted)]">
                            Gêneros Favoritos
                            <span className="text-sm font-normal text-gray-500 ml-2">(Selecione quantos quiser)</span>
                        </h2>
                        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {getCurrentGenres().map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleGenre(genre, getCurrentData().genres, getCurrentSetter())}
                                    className={`px-4 py-2 rounded-full text-sm transition ${getCurrentData().genres.includes(genre)
                                        ? 'bg-gradient-to-r from-orange-600 to-purple-600 text-white shadow-lg shadow-purple-900/20'
                                        : 'bg-[var(--bg)] text-[var(--text-muted)] hover:bg-[var(--border)]'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Platform Links Section */}
                    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 text-[var(--text-muted)]">Links de Perfil</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getCurrentPlatforms().map(platform => (
                                <div key={platform.id} className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold ml-1">
                                        {platform.name}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={platform.placeholder}
                                        value={getCurrentData().platformLinks[platform.id] || ''}
                                        onChange={(e) => updateLink(platform.id, e.target.value, getCurrentData().platformLinks, getCurrentSetter())}
                                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-sm focus:border-[var(--primary)] focus:outline-none transition text-[var(--text)]"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Favorites Section */}
                    <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[var(--text-muted)]">Top 5 Favoritos</h2>
                            <span className="text-sm text-[var(--text-muted)]">{getCurrentData().favorites.length}/5</span>
                        </div>

                        {/* Favorites Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                            {getCurrentData().favorites.map((fav: any, index: number) => (
                                <div key={index} className="relative group aspect-[3/4] bg-[var(--bg)] rounded-xl overflow-hidden border border-[var(--border)]">
                                    <img
                                        src={
                                            fav.appid
                                                ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${fav.appid}/header.jpg`
                                                : (fav.imageUrl || fav.itemImageUrl || '/placeholder.png')
                                        }
                                        alt={fav.name || fav.itemName || fav.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.currentTarget.src = '/placeholder.png'}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <button
                                            onClick={() => removeFavorite(index)}
                                            className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                                        >
                                            <LuX size={20} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                                        <p className="text-xs font-bold truncate text-center">{fav.name || fav.itemName || fav.title}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Add Button Placeholders */}
                            {Array.from({ length: 5 - getCurrentData().favorites.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-[3/4] bg-[var(--bg)] rounded-xl border border-[var(--border)] border-dashed flex items-center justify-center text-[var(--text-muted)]">
                                    <span className="text-xs">Vazio</span>
                                </div>
                            ))}
                        </div>

                        {/* Search Area */}
                        <div className="relative">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                    <input
                                        type="text"
                                        placeholder={`Pesquisar ${activeTab}...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        // Removed onKeyDown because we are using debounce
                                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 focus:border-[var(--primary)] focus:outline-none transition text-[var(--text)]"
                                    />
                                </div>
                                <button
                                    onClick={() => handleSearch(searchQuery)}
                                    disabled={searching}
                                    className="px-6 py-3 bg-[var(--border)] hover:bg-[#333] rounded-xl font-semibold transition"
                                >
                                    {searching ? '...' : 'Buscar'}
                                </button>
                            </div>

                            {/* Search Results Dropdown/Grid */}
                            {searchResults.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)]">
                                    {searchResults.slice(0, 10).map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => addFavorite(item)}
                                            className="relative aspect-[3/4] group text-left"
                                        >
                                            <div className="w-full h-full rounded-lg overflow-hidden border border-[var(--border)] group-hover:border-[var(--primary)] transition">
                                                <img
                                                    src={
                                                        item.appid
                                                            ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${item.appid}/header.jpg`
                                                            : (item.imageUrl || item.images?.jpg?.image_url || '/placeholder.png')
                                                    }
                                                    alt={item.name || item.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.currentTarget.src = '/placeholder.png'}
                                                />
                                            </div>
                                            <p className="mt-2 text-xs font-medium truncate group-hover:text-[var(--primary)] transition">
                                                {item.name || item.title || `${item.name} - ${item.artist}`}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${active
                ? 'bg-gradient-to-r from-orange-600 to-purple-600 text-white shadow-lg shadow-purple-900/20'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-white'
                }`}
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );
}
