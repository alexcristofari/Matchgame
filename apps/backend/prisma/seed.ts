import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database from profiles.json...');

    const passwordHash = await bcrypt.hash('password123', 10);

    const profilesPath = path.join(__dirname, '../../../packages/database/profiles.json');
    const profilesData = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));

    console.log(`Found ${profilesData.length} profiles to seed.`);

    // DELETE existing users to avoid conflicts and clean up meme profiles
    await prisma.favorite.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data.');

    for (const p of profilesData) {
        const favorites: any[] = [];

        if (p.interests?.games) {
            p.interests.games.forEach((game: string, index: number) => {
                favorites.push({ category: 'games', itemId: `game-${index}`, itemName: game, position: index + 1 });
            });
        }
        if (p.interests?.movies) {
            p.interests.movies.forEach((movie: string, index: number) => {
                favorites.push({ category: 'movies', itemId: `movie-${index}`, itemName: movie, position: index + 1 });
            });
        }
        if (p.interests?.music) {
            p.interests.music.forEach((music: string, index: number) => {
                favorites.push({ category: 'music', itemId: `music-${index}`, itemName: music, position: index + 1 });
            });
        }

        // Calculate birthDate from age if not present (approximate)
        const birthDate = p.age ? new Date(new Date().setFullYear(new Date().getFullYear() - p.age)) : new Date('2000-01-01');

        await prisma.user.create({
            data: {
                email: p.email,
                name: p.name,
                passwordHash,
                profile: {
                    create: {
                        bio: p.bio,
                        location: p.location,
                        birthDate: birthDate,
                        // gender: p.gender, // Field not in schema, ignoring
                        photos: JSON.stringify(p.images || []),
                    }
                },
                favorites: {
                    create: favorites
                }
            }
        });
        console.log(`Created user: ${p.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        const fs = require('fs');
        fs.writeFileSync('seed_error.log', JSON.stringify(e, null, 2) + '\n' + e.toString());
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
