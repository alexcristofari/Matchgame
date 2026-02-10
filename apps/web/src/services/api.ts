import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });

                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    register: async (data: { email: string; password: string; name: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        await api.post('/auth/logout', { refreshToken });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    me: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Users API
export const usersApi = {
    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateMe: async (data: { name?: string }) => {
        const response = await api.patch('/users/me', data);
        return response.data;
    },
};

// Profiles API
export const profilesApi = {
    getMyProfile: async () => {
        const response = await api.get('/profiles/me');
        return response.data;
    },

    createProfile: async (data: {
        bio?: string;
        birthDate?: string;
        location?: string;
        lookingFor?: 'friendship' | 'relationship' | 'both';
    }) => {
        const response = await api.post('/profiles', data);
        return response.data;
    },

    updateProfile: async (data: {
        bio?: string;
        location?: string;
        lookingFor?: 'friendship' | 'relationship' | 'both';
    }) => {
        const response = await api.patch('/profiles/me', data);
        return response.data;
    },
};

// Integrations API
export const integrationsApi = {
    // Get status of all integrations
    getStatus: async () => {
        const response = await api.get('/integrations/status');
        return response.data;
    },

    // Steam
    connectSteam: async (steamId: string) => {
        const response = await api.post('/integrations/steam/connect', { steamId });
        return response.data;
    },

    getSteam: async () => {
        const response = await api.get('/integrations/steam');
        return response.data;
    },

    disconnectSteam: async () => {
        const response = await api.delete('/integrations/steam');
        return response.data;
    },

    // Favorites (Global)
    searchGames: async (query: string) => {
        const response = await api.get(`/favorites/games/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getFavoriteGames: async () => {
        const response = await api.get('/favorites/games');
        return response.data;
    },

    saveFavoriteGames: async (favorites: { appid: number; name: string; iconUrl?: string }[]) => {
        const response = await api.put('/favorites/games', { favorites });
        return response.data;
    },

    // Legacy (Steam Integration)
    getSteamGames: async () => {
        const response = await api.get('/integrations/steam/games');
        return response.data;
    },

    // Spotify
    getSpotifyAuthUrl: async () => {
        const response = await api.get('/integrations/spotify/auth');
        return response.data;
    },

    getSpotify: async () => {
        const response = await api.get('/integrations/spotify');
        return response.data;
    },

    disconnectSpotify: async () => {
        const response = await api.delete('/integrations/spotify');
        return response.data;
    },
    saveSpotifyManual: async (data: { profileUrl?: string; playlists?: string[]; genres?: string[]; topSongs?: any[] }) => {
        const response = await api.put('/integrations/spotify/manual', data);
        return response.data;
    },

    searchSpotifyTracks: async (query: string) => {
        const response = await api.get(`/integrations/spotify/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getSpotifyGenres: async () => {
        const response = await api.get('/integrations/spotify/genres');
        return response.data;
    },

    // Anime (MAL/Jikan)
    searchAnime: async (query: string) => {
        const response = await api.get(`/integrations/anime/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getAnimeGenres: async () => {
        const response = await api.get('/integrations/anime/genres');
        return response.data;
    },

    getAnime: async () => {
        const response = await api.get('/integrations/anime');
        return response.data;
    },

    saveAnimeManual: async (data: { genres?: string[]; favorites?: any[] }) => {
        const response = await api.put('/integrations/anime/manual', data);
        return response.data;
    },

    // Movies (TMDB)
    searchMovies: async (query: string) => {
        const response = await api.get(`/integrations/movie/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getMovieGenres: async () => {
        const response = await api.get('/integrations/movie/genres');
        return response.data;
    },

    getMovie: async () => {
        const response = await api.get('/integrations/movie');
        return response.data;
    },

    saveMovieManual: async (data: { genres?: string[]; favorites?: any[] }) => {
        const response = await api.put('/integrations/movie/manual', data);
        return response.data;
    },
};

// Discovery API
export const discoveryApi = {
    getRecommendations: async () => {
        const response = await api.get('/matches/recommendations');
        return response.data;
    },

    swipe: async (targetUserId: string, action: 'like' | 'pass' | 'superlike') => {
        const response = await api.post('/matches/swipe', { targetUserId, action });
        return response.data;
    },
};

export default api;
