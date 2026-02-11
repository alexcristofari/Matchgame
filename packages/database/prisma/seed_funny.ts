
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Load the JSON
const jsonPath = path.join(__dirname, '../funny_profiles.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const profiles = JSON.parse(rawData);

async function main() {
    console.log(`🌱 Start seeding ${profiles.length} funny profiles...`);

    // Extract emails from JSON to identify which users to keep
    const emailsToKeep = profiles.map((p: any) => p.email);

    // Delete users that are NOT in the JSON list (cleanup)
    // First, delete related records to avoid foreign key constraints
    await prisma.dislike.deleteMany({
        where: {
            OR: [
                { fromUserId: { notIn: Array.isArray(emailsToKeep) ? [] : [] /* Safety check */ } }, // Cannot filter by user not in list easily via relation here
                // Easier: Find users to delete first
            ]
        }
    });

    const usersToDelete = await prisma.user.findMany({
        where: {
            email: {
                notIn: emailsToKeep,
                endsWith: '@matchgame.dev' // SAFETY: Only delete bot accounts
            }
        },
        select: { id: true }
    });

    const userIdsToDelete = usersToDelete.map(u => u.id);

    if (userIdsToDelete.length > 0) {
        console.log(`Cleaning up ${userIdsToDelete.length} users...`);
        // Delete dependencies
        await prisma.dislike.deleteMany({
            where: { OR: [{ fromUserId: { in: userIdsToDelete } }, { toUserId: { in: userIdsToDelete } }] }
        });
        await prisma.like.deleteMany({
            where: { OR: [{ fromUserId: { in: userIdsToDelete } }, { toUserId: { in: userIdsToDelete } }] }
        });
        await prisma.match.deleteMany({
            where: { OR: [{ user1Id: { in: userIdsToDelete } }, { user2Id: { in: userIdsToDelete } }] }
        });
        await prisma.message.deleteMany({
            where: { senderId: { in: userIdsToDelete } }
        });
        // Profile/Favorites cascade automatically usually, but let's be safe

        const deleteResult = await prisma.user.deleteMany({
            where: {
                id: { in: userIdsToDelete }
            }
        });
        console.log(`🗑️  Deleted ${deleteResult.count} old profiles.`);
    }

    const currentYear = new Date().getFullYear();

    for (const p of profiles) {
        // Calculate birth year from age (approx)
        const birthYear = currentYear - p.age;
        const birthDate = new Date(`${birthYear}-01-01`);

        // Prepare favorites
        // The JSON has { games: string[], music: string[], ... }
        // The Schema expects Favorite[]
        const favoritesData = [];

        let position = 1;
        if (p.interests?.games) {
            for (const game of p.interests.games.slice(0, 3)) {
                favoritesData.push({
                    category: 'games',
                    position: position++,
                    itemId: `game_${sanitize(game)}`,
                    itemName: game,
                    itemImageUrl: 'https://via.placeholder.com/150'
                });
            }
        }

        position = 1;
        if (p.interests?.music) {
            for (const music of p.interests.music.slice(0, 3)) {
                favoritesData.push({
                    category: 'music',
                    position: position++,
                    itemId: `music_${sanitize(music)}`,
                    itemName: music,
                    itemImageUrl: 'https://via.placeholder.com/150'
                });
            }
        }

        position = 1;
        if (p.interests?.movies) {
            for (const movie of p.interests.movies.slice(0, 3)) {
                favoritesData.push({
                    category: 'movies',
                    position: position++,
                    itemId: `movie_${sanitize(movie)}`,
                    itemName: movie,
                    itemImageUrl: 'https://via.placeholder.com/150'
                });
            }
        }

        // Upsert User
        console.log(`Processing ${p.name}...`);

        try {
            await prisma.user.upsert({
                where: { email: p.email },
                update: {
                    name: p.name,
                    profile: {
                        upsert: {
                            create: {
                                bio: p.bio,
                                location: p.location,
                                birthDate: birthDate,
                                photos: JSON.stringify(p.images || []),
                                lookingFor: 'both'
                            },
                            update: {
                                bio: p.bio,
                                location: p.location,
                                birthDate: birthDate,
                                photos: JSON.stringify(p.images || []),
                            }
                        }
                    }
                    // Updating favorites is tricky in upsert, usually cleaner to deleteMany and create
                },
                create: {
                    email: p.email,
                    name: p.name,
                    passwordHash: '$2a$10$abcdefg...', // Dummy hash
                    profile: {
                        create: {
                            bio: p.bio,
                            location: p.location,
                            birthDate: birthDate,
                            photos: JSON.stringify(p.images || []),
                            lookingFor: 'both'
                        }
                    },
                    favorites: {
                        create: favoritesData
                    }
                }
            });

            // If updated, we might want to refresh favorites manually
            // But for now let's assume create suffices or we ignore old favorites updates
            // To be thorough:
            const user = await prisma.user.findUnique({ where: { email: p.email } });
            if (user) {
                // Delete existing favorites to replace with new ones
                await prisma.favorite.deleteMany({ where: { userId: user.id } });
                await prisma.favorite.createMany({
                    data: favoritesData.map(f => ({ ...f, userId: user.id }))
                });
            }

        } catch (e) {
            console.error(`Error processing ${p.name}:`, e);
        }
    }

    console.log('✅ Seeding finished.');
}

function sanitize(str: string) {
    return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
