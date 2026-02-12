
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';

async function main() {
    // 1. Reset password for a seed user
    const email = 'gamer@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email },
        data: { passwordHash: hashedPassword }
    });
    console.log(`Updated password for ${email}`);

    // 2. Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData = await loginRes.json() as any;
    const token = loginData.data?.tokens?.accessToken;
    console.log('Logged in, token received:', token ? token.substring(0, 20) + '...' : 'undefined');
    console.log('Full token:', token);

    // 3. Get Recommendations
    const recRes = await fetch(`${API_URL}/matches/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!recRes.ok) {
        console.error('Recommendations failed:', await recRes.text());
        return;
    }

    const recData = await recRes.json() as any;
    console.log('Recommendations response:', JSON.stringify(recData, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
