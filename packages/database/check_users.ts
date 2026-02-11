
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, name: true }
    });

    console.log(`Found ${users.length} users in database:`);
    users.forEach(u => console.log(`- ${u.name} (${u.email})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
