import { prisma } from '../../shared/db';

interface UserPreferences {
    gameGenres: Map<string, number>;
    movieGenres: Map<string, number>;
    animeGenres: Map<string, number>;
    musicGenres: Map<string, number>;
}

export class MatchesService {

    /**
     * Calculates the compatibility score between two users based on their shared interests.
     * Uses a weighted hybrid approach (Jaccard + Cosine Similarity concepts).
     */
    /**
     * Calculates compatibility score using pre-fetched favorites data.
     * Avoids database calls inside loops.
     */
    calculateCompatibilityFromFavorites(user1Favorites: any[], user2Favorites: any[]): number {
        try {
            const prefs1 = this.processUserInterests(user1Favorites);
            const prefs2 = this.processUserInterests(user2Favorites);

            return this.calculateScore(prefs1, prefs2);
        } catch (error) {
            console.error('Error calculating compatibility from favorites:', error);
            return 0;
        }
    }

    /**
     * Internal reuse of score calculation logic
     */
    private calculateScore(user1: UserPreferences, user2: UserPreferences): number {
        // 2. Calculate Domain Scores
        const gameScore = this.calculateGenreSimilarity(user1.gameGenres, user2.gameGenres);
        const movieScore = this.calculateGenreSimilarity(user1.movieGenres, user2.movieGenres);
        const animeScore = this.calculateGenreSimilarity(user1.animeGenres, user2.animeGenres);
        const musicScore = this.calculateGenreSimilarity(user1.musicGenres, user2.musicGenres);

        // 3. Weighted Average
        let totalWeight = 0;
        let totalScore = 0;

        if (user1.gameGenres.size > 0 && user2.gameGenres.size > 0) {
            totalScore += gameScore * 0.35;
            totalWeight += 0.35;
        }
        if (user1.movieGenres.size > 0 && user2.movieGenres.size > 0) {
            totalScore += movieScore * 0.25;
            totalWeight += 0.25;
        }
        if (user1.animeGenres.size > 0 && user2.animeGenres.size > 0) {
            totalScore += animeScore * 0.20;
            totalWeight += 0.20;
        }
        if (user1.musicGenres.size > 0 && user2.musicGenres.size > 0) {
            totalScore += musicScore * 0.20;
            totalWeight += 0.20;
        }

        if (totalWeight === 0) return 0;

        const finalScore = Math.round((totalScore / totalWeight) * 100);
        return Math.min(finalScore, 100);
    }

    /**
     * Legacy method - kept for backward compatibility if needed, 
     * but refactored to use the shared logic.
     */
    async calculateCompatibility(userId1: string, userId2: string): Promise<number> {
        try {
            const [user1, user2] = await Promise.all([
                this.getUserInterests(userId1),
                this.getUserInterests(userId2)
            ]);

            if (!user1 || !user2) return 0;
            return this.calculateScore(user1, user2);
        } catch (error) {
            console.error('Error calculating compatibility:', error);
            return 0;
        }
    }

    private async getUserInterests(userId: string): Promise<UserPreferences | null> {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { mediaItem: true }
        });
        return this.processUserInterests(favorites);
    }

    /**
     * Converts raw favorites (with mediaItems) into UserPreferences map
     */
    private processUserInterests(favorites: any[]): UserPreferences {
        const prefs: UserPreferences = {
            gameGenres: new Map(),
            movieGenres: new Map(),
            animeGenres: new Map(),
            musicGenres: new Map()
        };

        if (!favorites || favorites.length === 0) return prefs;

        for (const fav of favorites) {
            if (!fav.mediaItem?.genres) continue;

            try {
                const genres: string[] = JSON.parse(fav.mediaItem.genres);
                let targetMap: Map<string, number> | null = null;

                switch (fav.category) {
                    case 'games': targetMap = prefs.gameGenres; break;
                    case 'movies': targetMap = prefs.movieGenres; break;
                    case 'anime': targetMap = prefs.animeGenres; break;
                    case 'music': targetMap = prefs.musicGenres; break;
                }

                if (targetMap) {
                    for (const g of genres) {
                        targetMap.set(g, (targetMap.get(g) || 0) + 1);
                    }
                }
            } catch (e) {
                // ignore parsing error
            }
        }

        return prefs;
    }

    /**
     * Calculates Cosine Similarity between two genre frequency maps.
     * Vec A = { Action: 3, RPG: 1 }
     * Vec B = { Action: 1, Strategy: 2 }
     */
    private calculateGenreSimilarity(map1: Map<string, number>, map2: Map<string, number>): number {
        if (map1.size === 0 || map2.size === 0) return 0;

        const allGenres = new Set([...map1.keys(), ...map2.keys()]);

        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;

        for (const genre of allGenres) {
            const val1 = map1.get(genre) || 0;
            const val2 = map2.get(genre) || 0;

            dotProduct += val1 * val2;
            mag1 += val1 * val1;
            mag2 += val2 * val2;
        }

        if (mag1 === 0 || mag2 === 0) return 0;

        return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }
}

export const matchesService = new MatchesService();
