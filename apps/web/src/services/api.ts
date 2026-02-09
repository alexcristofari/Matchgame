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

export default api;
