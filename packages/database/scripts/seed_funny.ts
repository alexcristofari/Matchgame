
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting funny seed...');

    const profilesPath = path.join(__dirname, 'funny_profiles.json');
    const profilesData = JSON.parse(fs.readFileSync(profilesPath, 'utf-8'));

    const passwordHash = await bcrypt.hash('password123', 10);

    for (const p of profilesData) {
        // Create User
        const user = await prisma.user.upsert({
            where: { email: p.email },
            update: {},
            create: {
                email: p.email,
                name: p.name,
                passwordHash,
            },
        });

        console.log(`👤 Created/Found user: ${user.name}`);

        // Create Profile
        const birthDate = new Date();
        birthDate.setFullYear(birthDate.getFullYear() - p.age);

        // Note: 'gender' field is not in Profile schema, it might be used for filtering logic later or we should add it to schema.
        // For now, we omit it to avoid errors.
        await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
                bio: p.bio,
                birthDate,
                location: p.location,
                photos: JSON.stringify(p.images),
            },
            create: {
                userId: user.id,
                bio: p.bio,
                birthDate,
                location: p.location,
                photos: JSON.stringify(p.images),
            },
        });

        // Add Fav Games (Mock)
        if (p.interests.games) {
            // Limpar games anteriores desse user mock
            await prisma.favorite.deleteMany({
                where: {
                    userId: user.id,
                    category: 'games'
                }
            });

            let position = 1;
            for (const gameName of p.interests.games) {
                if (position > 3) break; // Limit to 3 games as per Favorite model usually

                // Mock AppID (hash simples do nome para gerar ID único)
                const mockAppId = String(gameName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) * 100);

                await prisma.favorite.create({
                    data: {
                        userId: user.id,
                        category: 'games',
                        position: position++,
                        itemId: mockAppId,
                        itemName: gameName,
                        itemImageUrl: `https://steamcdn-a.akamaihd.net/steam/apps/${mockAppId}/header.jpg` // Mock image
                    }
                });
            }
        }

        // Add Fav Artists (Mock Spotify) - se houver tabela IntegrationSpotify ou similar
        // Por enquanto, salvamos apenas jogos que já temos estrutura garantida
    }

    console.log('✅ Funny seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
