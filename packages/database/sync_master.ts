import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const jsonPath = path.join(__dirname, 'profiles.json');

interface ProfileData {
    name: string;
    email: string;
    age: number;
    bio: string;
    location: string;
    gender: string;
    images: string[];
    interests: Record<string, string[]>;
}

async function main() {
    console.log('🔄 Starting Profile Sync...');

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ profiles.json not found!');
        process.exit(1);
    }

    const profiles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`📂 Found ${profiles.length} profiles to sync.`);

    for (const p of profiles) {
        try {
            // 1. Upsert User
            const user = await prisma.user.upsert({
                where: { email: p.email },
                update: {
                    name: p.name,
                    // age removed, not in User model
                    passwordHash: 'password123'
                },
                create: {
                    email: p.email,
                    name: p.name,
                    // age removed
                    passwordHash: 'password123'
                }
            });

            // Calculate birthDate from age (approximate)
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - p.age);

            // 2. Upsert Profile
            await prisma.profile.upsert({
                where: { userId: user.id },
                update: {
                    displayName: p.name, // adding name for visibility
                    bio: p.bio,
                    location: p.location,
                    birthDate: birthDate,
                    favoriteGame: p.interests?.games?.[0] || null,
                    favoriteMovie: p.interests?.movies?.[0] || null,
                    favoriteMusic: p.interests?.music?.[0] || null,
                    photos: JSON.stringify(p.images || [])
                },
                create: {
                    userId: user.id,
                    displayName: p.name,
                    bio: p.bio,
                    location: p.location,
                    birthDate: birthDate,
                    favoriteGame: p.interests?.games?.[0] || null,
                    favoriteMovie: p.interests?.movies?.[0] || null,
                    favoriteMusic: p.interests?.music?.[0] || null,
                    photos: JSON.stringify(p.images || [])
                }
            });

            console.log(`✅ Synced: ${p.name}`);

        } catch (error) {
            console.error(`❌ Failed to sync ${p.name}:`, error);
        }
    }

    console.log('✨ Sync Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
