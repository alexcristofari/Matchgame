

export class MovieService {
    private static API_BASE = 'https://api.themoviedb.org/3';
    private static get API_KEY() {
        return process.env.TMDB_API_KEY || '';
    }

    private static getHeaders() {
        return {
            'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN || ''}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Search movies by query
     */
    static async searchMovies(query: string) {
        try {
            console.log('[MovieService] Search query:', query);
            console.log('[MovieService] API Key present:', !!this.API_KEY);

            if (!this.API_KEY) {
                console.warn('[MovieService] Missing TMDB_API_KEY');
                return [];
            }

            const url = `${this.API_BASE}/search/movie?api_key=${this.API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&page=1`;
            console.log('[MovieService] Fetching:', url.replace(this.API_KEY, '***'));

            const response = await fetch(url);
            console.log('[MovieService] Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[MovieService] searchMovies Error: ${response.status}`, errorText);
                throw new Error('Erro ao buscar filmes');
            }

            const data = await response.json() as any;
            console.log('[MovieService] Found results:', data.results?.length);

            return data.results.map((movie: any) => ({
                id: movie.id,
                title: movie.title,
                originalTitle: movie.original_title,
                imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                overview: movie.overview
            })).slice(0, 10);

        } catch (error) {
            console.error('[MovieService] searchMovies Exception:', error);
            throw error;
        }
    }

    /**
     * Get movie genres
     */
    static async getGenres() {
        try {
            if (!this.API_KEY) {
                // Fallback if no key
                return this.getFallbackGenres();
            }

            const url = `${this.API_BASE}/genre/movie/list?api_key=${this.API_KEY}&language=pt-BR`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erro ao buscar gêneros de filmes');
            }

            const data = await response.json() as any;
            return data.genres.map((g: any) => g.name);

        } catch (error) {
            console.error('[MovieService] getGenres Exception:', error);
            return this.getFallbackGenres();
        }
    }

    private static getFallbackGenres() {
        return [
            "Ação", "Aventura", "Animação", "Comédia", "Crime",
            "Documentário", "Drama", "Família", "Fantasia", "História",
            "Terror", "Música", "Mistério", "Romance", "Ficção científica",
            "Cinema TV", "Thriller", "Guerra", "Faroeste"
        ];
    }
}
