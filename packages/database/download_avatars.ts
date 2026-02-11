
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import profiles from './funny_profiles.json';

const TARGET_DIR = path.join(__dirname, '../../apps/web/public/avatars');

async function downloadImage(url: string, filename: string) {
    try {
        const filepath = path.join(TARGET_DIR, filename);
        if (fs.existsSync(filepath)) {
            console.log(`Skipping ${filename}, already exists.`);
            return;
        }

        console.log(`Downloading ${url} to ${filename}...`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(filepath, response.data);
        console.log(`✅ Saved ${filename}`);
    } catch (error) {
        console.error(`❌ Failed to download ${url}:`, error.message);
    }
}

async function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    for (const profile of profiles) {
        if (profile.images && profile.images.length > 0) {
            const url = profile.images[0];
            const ext = url.includes('.svg') ? 'svg' : 'jpg'; // Simple extension detection
            // Sanitize name for filename
            const saneName = profile.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const filename = `${saneName}.${ext}`;

            await downloadImage(url, filename);
        }
    }
}

main();
