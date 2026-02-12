
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPhotos() {
    const user = await prisma.user.findFirst({
        where: { email: 'erick.bagra@matchgame.dev' },
        include: { profile: true }
    });

    if (user && user.profile) {
        console.log('User:', user.name);
        console.log('Photos (Raw):', user.profile.photos);
        try {
            console.log('Photos (Parsed):', JSON.parse(user.profile.photos));
        } catch (e) {
            console.log('Error parsing JSON:', e);
        }
    } else {
        console.log('User not found');
    }
}

checkPhotos()
    .finally(() => prisma.$disconnect());
