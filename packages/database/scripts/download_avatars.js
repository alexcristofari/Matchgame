
const fs = require('fs');
const path = require('path');
const profiles = require('./funny_profiles.json');

const TARGET_DIR = path.join(__dirname, '../../apps/web/public/avatars');

// Helper to determine extension from Content-Type
function getExtension(cntType, url) {
    if (url.includes('dicebear')) return 'svg'; // Force SVG for DiceBear
    if (cntType?.includes('svg')) return 'svg';
    if (cntType?.includes('jpeg') || cntType?.includes('jpg')) return 'jpg';
    if (cntType?.includes('png')) return 'png';
    if (cntType?.includes('webp')) return 'webp';
    return 'jpg'; // Default
}

async function downloadImage(url, name) {
    const doDownload = async (targetUrl) => {
        console.log(`Fetching ${targetUrl}...`);
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        });
        if (!response.ok) {
            // Don't try to read text if it might be binary or huge, just status
            throw new Error(`Status ${response.status} (${response.statusText})`);
        }
        return {
            buffer: await response.arrayBuffer(),
            contentType: response.headers.get('content-type')
        };
    };

    try {
        let data, contentType;
        try {
            const res = await doDownload(url);
            data = res.buffer;
            contentType = res.contentType;
        } catch (err) {
            console.warn(`⚠️ Failed primary download for ${name} (${url}): ${err.message}`);
            if (url.includes('api.dicebear.com')) {
                const baseUrl = url.split('?')[0];
                const seedMatch = url.match(/seed=([^&]+)/);
                if (seedMatch) {
                    const fallbackUrl = `${baseUrl}?seed=${seedMatch[1]}`;
                    console.log(`🔄 Retrying with fallback: ${fallbackUrl}`);
                    const res = await doDownload(fallbackUrl);
                    data = res.buffer;
                    contentType = res.contentType;
                } else {
                    throw err;
                }
            } else {
                // If it's a real photo (Wikimedia) and fails, we can't easily fallback to a "seed".
                // We just log it and return, so we don't crash the script.
                console.error(`❌ Skipping ${name} due to download failure.`);
                return;
            }
        }

        const ext = getExtension(contentType, url);
        const filename = `${name}.${ext}`;
        const filepath = path.join(TARGET_DIR, filename);

        // Delete any existing file with different extension for this name
        const possibleExts = ['jpg', 'svg', 'png', 'jpeg', 'webp'];
        possibleExts.forEach(e => {
            const oldPath = path.join(TARGET_DIR, `${name}.${e}`);
            if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (ev) { }
            }
        });

        fs.writeFileSync(filepath, Buffer.from(data));
        console.log(`✅ Saved ${filename} (${contentType})`);

    } catch (error) {
        console.error(`❌ Permanent failure for ${name}:`, error.message);
    }
}

async function main() {
    console.log(`Starting download to ${TARGET_DIR}`);
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // Create a Promise.all limit or just sequential? Sequential is safer for rate limits.
    for (const profile of profiles) {
        if (profile.images && profile.images.length > 0) {
            const url = profile.images[0];
            const saneName = profile.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

            await downloadImage(url, saneName);
            // Small delay
            await new Promise(r => setTimeout(r, 200));
        }
    }
    console.log('Done!');
}

main().catch(err => console.error('Fatal script error:', err));
