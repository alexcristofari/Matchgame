// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreateInput {
    email: string;
    password: string;
    name: string;
}

export interface UserLoginInput {
    email: string;
    password: string;
}

// Auth Types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: Omit<User, 'createdAt' | 'updatedAt'>;
    tokens: AuthTokens;
}

// Profile Types
export type LookingFor = 'friendship' | 'relationship' | 'both';

export interface Profile {
    id: string;
    userId: string;
    bio: string | null;
    birthDate: Date | null;
    location: string | null;
    lookingFor: LookingFor;
    photos: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Integration Types
export type IntegrationType = 'steam' | 'spotify' | 'riot' | 'tmdb' | 'mal' | 'discord';

export interface Integration {
    id: string;
    userId: string;
    type: IntegrationType;
    externalId: string;
    accessToken: string | null;
    refreshToken: string | null;
    data: Record<string, unknown>;
    syncedAt: Date | null;
}

// Favorite Types
export type FavoriteCategory = 'games' | 'music' | 'movies' | 'anime' | 'books';

export interface Favorite {
    id: string;
    userId: string;
    category: FavoriteCategory;
    position: number; // 1, 2, or 3
    itemId: string;
    itemName: string;
    itemImageUrl: string | null;
}

// Matching Types
export interface CompatibilityScore {
    total: number; // 0-100
    breakdown: {
        games: number;
        music: number;
        movies: number;
        anime: number;
        hobbies: number;
        favorites: number;
    };
}

// Like Types
export interface Like {
    id: string;
    fromUserId: string;
    toUserId: string;
    isSuperLike: boolean;
    createdAt: Date;
}

// Match Types
export interface Match {
    id: string;
    user1Id: string;
    user2Id: string;
    compatibilityScore: number;
    scoreBreakdown: CompatibilityScore['breakdown'];
    createdAt: Date;
}

// Chat Types
export interface Message {
    id: string;
    matchId: string;
    senderId: string;
    content: string;
    readAt: Date | null;
    createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
