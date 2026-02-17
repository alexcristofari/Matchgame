import { prisma } from '../../shared/db';

export class BooksService {
    // Google Books API Public
    private static readonly API_BASE = 'https://www.googleapis.com/books/v1/volumes';

    static readonly GENRES = [
        'Ficção', 'Fantasia', 'Romance', 'Terror', 'Mistério', 'Sci-Fi',
        'Biografia', 'História', 'Negócios', 'Autoajuda', 'Tecnologia',
        'Quadrinhos', 'Mangá', 'Poesia', 'Clássicos'
    ];

    /**
     * Search books in Google Books
     */
    static async searchBooks(query: string) {
        // Search restricted to Portuguese if possible, or general
        const url = `${this.API_BASE}?q=${encodeURIComponent(query)}&langRestrict=pt&maxResults=20`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                return [];
            }

            const data = await response.json() as any;
            if (!data.items) return [];

            return data.items.map((item: any) => {
                const info = item.volumeInfo;
                return {
                    id: item.id,
                    title: info.title,
                    authors: info.authors || [],
                    imageUrl: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
                    publishedDate: info.publishedDate
                };
            });
        } catch (error) {
            console.error('Book search error:', error);
            return [];
        }
    }

    /**
     * Get available genres
     */
    static getGenres() {
        return this.GENRES;
    }
}
