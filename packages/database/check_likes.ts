
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLikes() {
    try {
        const likeCount = await prisma.like.count();
        const dislikeCount = await prisma.dislike.count();

        console.log(`Total Likes: ${likeCount}`);
        console.log(`Total Dislikes: ${dislikeCount}`);

        const recentLikes = await prisma.like.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                fromUser: { select: { name: true } },
                toUser: { select: { name: true } }
            }
        });

        console.log('\nRecent Likes:');
        recentLikes.forEach(like => {
            console.log(`- ${like.fromUser.name} LIKED ${like.toUser.name} (${like.isSuperLike ? 'SUPERLIKE' : 'NORMAL'})`);
        });

    } catch (error) {
        console.error('Error checking likes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLikes();
