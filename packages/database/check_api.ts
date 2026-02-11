
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';

async function main() {
    // 1. Login as seeded user
    const email = 'erick.bagra@matchgame.dev';
    const password = 'password123';

    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json() as any;
    const token = loginData.data?.tokens?.accessToken;

    if (!token) {
        console.error('Login failed, no token');
        return;
    }

    // 2. Get Recommendations
    const recRes = await fetch(`${API_URL}/matches/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const recData = await recRes.json() as any;

    if (recData.success && recData.data.length > 0) {
        console.log(`Found ${recData.data.length} recommendations`);

        for (const user of recData.data) {
            console.log(`\nChecking user: ${user.name}`);
            console.log('Photos Type:', typeof user.photos);
            console.log('Photos Value:', user.photos);
            if (user.photos && user.photos.length > 0) {
                console.log('✅ Has photos:', user.photos[0]);
            } else {
                console.log('❌ No photos');
            }
        }
    } else {
        console.log('No recommendations found or success=false', recData);
    }
}

main().finally(() => prisma.$disconnect());
