import { prisma } from '../../shared/db';
import axios from 'axios';

// API Keys should be in .env, but for now accessing process.env directly
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

export class MediaService {

    /**
     * Ensures a MediaItem exists in the database with rich metadata.
     * If not, fetches from the external API and creates it.
     */
    async ensureMediaItem(externalId: string, type: 'GAME' | 'MOVIE' | 'ANIME' | 'MUSIC', title: string): Promise<string | null> {
        try {
            // 1. Check if exists
            const existing = await prisma.mediaItem.findUnique({
                where: {
                    externalId_type: {
                        externalId,
                        type
                    }
                }
            });

            if (existing) {
                return existing.id;
            }

            // 2. If not, fetch details and create
            console.log(`[MediaService] Ingesting ${type} ${externalId}: ${title}`);

            let metadata: any = {
                overview: null,
                genres: [],
                keywords: [],
                voteAverage: null,
                popularity: null,
                releaseDate: null,
                developer: null,
                publisher: null
            };

            if (type === 'MOVIE') {
                metadata = await this.fetchTmdbMovieDetails(externalId);
            } else if (type === 'GAME') {
                metadata = await this.fetchSteamGameDetails(externalId);
            }
            // Add Anime/Music logic later

            // 3. Save to DB
            const newItem = await prisma.mediaItem.create({
                data: {
                    externalId,
                    type,
                    title,
                    overview: metadata.overview,
                    genres: JSON.stringify(metadata.genres),
                    keywords: JSON.stringify(metadata.keywords),
                    voteAverage: metadata.voteAverage,
                    popularity: metadata.popularity,
                    releaseDate: metadata.releaseDate ? new Date(metadata.releaseDate) : null,
                    developer: metadata.developer,
                    publisher: metadata.publisher
                }
            });

            return newItem.id;

        } catch (error) {
            console.error(`[MediaService] Error ingesting ${type} ${externalId}:`, error);
            // Fallback: create basic item without metadata so functionality doesn't break
            try {
                const basicItem = await prisma.mediaItem.create({
                    data: {
                        externalId,
                        type,
                        title
                    }
                });
                return basicItem.id;
            } catch (e) {
                return null;
            }
        }
    }

    private async fetchTmdbMovieDetails(tmdbId: string) {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=keywords,credits`);
            const data = res.data;

            return {
                overview: data.overview,
                genres: data.genres.map((g: any) => g.name),
                keywords: data.keywords?.keywords?.map((k: any) => k.name) || [],
                voteAverage: data.vote_average,
                popularity: data.popularity,
                releaseDate: data.release_date
            };
        } catch (e) {
            console.error('Error fetching TMDB details:', e);
            return {};
        }
    }

    private async fetchSteamGameDetails(appId: string) {
        try {
            // Steam Store API is public but rate limited. No key needed for app details strictly, but good to have.
            const res = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
            if (res.data && res.data[appId] && res.data[appId].success) {
                const data = res.data[appId].data;
                return {
                    overview: data.short_description,
                    genres: data.genres?.map((g: any) => g.description) || [],
                    keywords: data.categories?.map((c: any) => c.description) || [],
                    voteAverage: null, // Steam doesn't give simple score here
                    popularity: null,
                    releaseDate: data.release_date?.date, // strict parsing needed often
                    developer: data.developers?.[0],
                    publisher: data.publishers?.[0]
                };
            }
            return {};
        } catch (e) {
            console.error('Error fetching Steam details:', e);
            return {};
        }
    }
}

export const mediaService = new MediaService();
