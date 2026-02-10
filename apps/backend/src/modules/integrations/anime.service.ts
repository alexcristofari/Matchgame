

export class AnimeService {
    private static API_BASE = 'https://api.jikan.moe/v4';

    /**
     * Search anime by query
     */
    static async searchAnime(query: string) {
        try {
            // Jikan API search
            const response = await fetch(`${this.API_BASE}/anime?q=${encodeURIComponent(query)}&limit=10`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[AnimeService] searchAnime Error: ${response.status}`, errorText);
                throw new Error('Erro ao buscar animes');
            }

            const data = await response.json() as any;

            // Map to simplified format for our app
            return data.data.map((anime: any) => ({
                id: anime.mal_id,
                title: anime.title,
                imageUrl: anime.images?.jpg?.image_url,
                year: anime.year,
                genres: anime.genres?.map((g: any) => g.name) || []
            }));

        } catch (error) {
            console.error('[AnimeService] searchAnime Exception:', error);
            throw error;
        }
    }

    /**
     * Get anime genres
     * Jikan returns a lot of specific genres/demographics, we might want to filter or return all.
     */
    static async getGenres() {
        try {
            const response = await fetch(`${this.API_BASE}/genres/anime`);

            if (!response.ok) {
                throw new Error('Erro ao buscar gêneros de anime');
            }

            const data = await response.json() as any;
            return data.data.map((g: any) => g.name);

        } catch (error) {
            console.error('[AnimeService] getGenres Exception:', error);
            // Fallback genres if API fails (rate limits etc)
            return [
                "Action", "Adventure", "Avant Garde", "Award Winning", "Boys Love",
                "Comedy", "Drama", "Fantasy", "Girls Love", "Gourmet", "Horror",
                "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
                "Supernatural", "Suspense"
            ];
        }
    }
}
