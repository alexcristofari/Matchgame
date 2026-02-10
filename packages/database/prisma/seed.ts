import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding...');

    const users = [
        {
            email: 'gamer@example.com',
            name: 'Alex Gamer',
            bio: 'Viciado em RPGs e FPS. Top 1 global no CS2 (nos meus sonhos).',
            location: 'São Paulo, SP',
            birthDate: new Date('1998-05-15'),
            photos: ['https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80'],
            favorites: [
                { category: 'games', position: 1, itemId: '730', itemName: 'Counter-Strike 2', itemImageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg' },
                { category: 'games', position: 2, itemId: '570', itemName: 'Dota 2', itemImageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg' },
            ],
            integration: { type: 'steam', externalId: '76561198000000001', data: JSON.stringify({ gameCount: 150 }) }
        },
        {
            email: 'music@example.com',
            name: 'Julia Beats',
            bio: 'Música é vida. Swiftie de carteirinha. 🎸',
            location: 'Rio de Janeiro, RJ',
            birthDate: new Date('2000-11-20'),
            photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80'],
            favorites: [
                { category: 'music', position: 1, itemId: 'ts-1', itemName: 'Cruel Summer', itemImageUrl: 'https://i.scdn.co/image/ab67616d0000b273e787cffec20aa2a396a61647' },
                { category: 'music', position: 2, itemId: 'ts-2', itemName: 'Anti-Hero', itemImageUrl: 'https://i.scdn.co/image/ab67616d0000b273bb54dde5369e8c4b45faad08' },
            ],
            integration: { type: 'spotify', externalId: 'spotify_user_1', data: JSON.stringify({ playlists: ['Top 50 Global'] }) }
        },
        {
            email: 'otaku@example.com',
            name: 'Kenji Sato',
            bio: 'Procurando alguém para maratonar One Piece. 🏴‍☠️',
            location: 'Curitiba, PR',
            birthDate: new Date('1999-03-10'),
            photos: ['https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80'],
            favorites: [
                { category: 'anime', position: 1, itemId: '21', itemName: 'One Piece', itemImageUrl: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg' },
                { category: 'anime', position: 2, itemId: '16498', itemName: 'Attack on Titan', itemImageUrl: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg' },
            ],
            integration: { type: 'mal', externalId: 'mal_user_1', data: JSON.stringify({ favorites: ['One Piece'] }) }
        },
        {
            email: 'movie@example.com',
            name: 'Sarah Cine',
            bio: 'O Poderoso Chefão é superestimado? Vamos debater. 🍿',
            location: 'Porto Alegre, RS',
            birthDate: new Date('1995-08-05'),
            photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1364&q=80'],
            favorites: [
                { category: 'movies', position: 1, itemId: '157336', itemName: 'Interstellar', itemImageUrl: 'https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
                { category: 'movies', position: 2, itemId: '27205', itemName: 'Inception', itemImageUrl: 'https://image.tmdb.org/t/p/w200/9gk7admal4zl62YggtFFBNE8uCV.jpg' },
            ],
            integration: { type: 'tmdb', externalId: 'tmdb_user_1', data: JSON.stringify({ favorites: ['Interstellar'] }) }
        },
        {
            email: 'geek@example.com',
            name: 'Max Power',
            bio: 'Um pouco de tudo: Games, Tech e Sci-Fi. 🚀',
            location: 'Florianópolis, SC',
            birthDate: new Date('2001-01-30'),
            photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80'],
            favorites: [
                { category: 'games', position: 1, itemId: '271590', itemName: 'GTA V', itemImageUrl: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg' },
                { category: 'music', position: 1, itemId: 'dk-1', itemName: 'Daft Punk', itemImageUrl: 'https://i.scdn.co/image/ab6761610000e5eb2d8544d678d495764d7dfc9d' },
            ],
            integration: { type: 'steam', externalId: '76561198000000002', data: JSON.stringify({ gameCount: 50 }) }
        }
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                name: u.name,
                passwordHash: 'seeded_hash', // Dummy hash
                profile: {
                    create: {
                        bio: u.bio,
                        location: u.location,
                        birthDate: u.birthDate,
                        photos: JSON.stringify(u.photos),
                        lookingFor: 'both'
                    }
                },
                favorites: {
                    create: u.favorites
                },
                integrations: {
                    create: {
                        type: u.integration.type,
                        externalId: u.integration.externalId,
                        data: u.integration.data
                    }
                }
            }
        });
        console.log(`Created user with id: ${user.id}`);
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
