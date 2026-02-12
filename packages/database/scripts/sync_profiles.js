
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'funny_profiles.json');
const avatarsDir = path.join(__dirname, '../../apps/web/public/avatars');

const profiles = require(jsonPath);
const files = fs.readdirSync(avatarsDir);

// 1. Helper to sanitize name
const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

// 2. Map files for easy lookup
const fileMap = new Map(); // sanitized_name -> full_filename
files.forEach(f => {
    const namePart = path.parse(f).name;
    fileMap.set(namePart, f);
});

const validProfiles = [];
const keptFilenames = new Set();

// 3. Process existing profiles
profiles.forEach(p => {
    const sName = sanitizeName(p.name);

    // Check exact match first
    // Check exact name match first
    if (fileMap.has(sName)) {
        const filename = fileMap.get(sName);
        p.images = [`/avatars/${filename}`]; // Update URL
        validProfiles.push(p);
        keptFilenames.add(filename);
    }
    // Check if the profile already points to a valid file
    else if (p.images && p.images.length > 0) {
        const currentPath = p.images[0];
        const currentFilename = path.basename(currentPath);

        if (Object.values(Object.fromEntries(fileMap)).includes(currentFilename)) {
            // File exists, simplify keep it
            validProfiles.push(p);
            keptFilenames.add(currentFilename);
        } else {
            console.log(`❌ Removing profile: ${p.name} (No photo found for ${sName} or ${currentFilename})`);
        }
    }
    else {
        console.log(`❌ Removing profile: ${p.name} (No photo found for ${sName})`);
    }
});

// 4. Find orphan photos (New Profiles)
files.forEach(f => {
    if (!keptFilenames.has(f)) {
        const namePart = path.parse(f).name;
        // Convert snake_case to Title Case for display name
        const displayName = namePart
            .split('_')
            .filter(x => x.length > 0)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

        console.log(`✨ Creating new profile for: ${f} -> ${displayName}`);

        const newProfile = {
            "name": displayName,
            "email": `${namePart}@matchgame.dev`,
            "age": 25,
            "bio": `New profile for ${displayName}. Edit this bio in funny_profiles.json`,
            "location": "Unknown",
            "gender": "unknown",
            "images": [`/avatars/${f}`],
            "interests": {
                "games": ["Edit Me"],
                "music": ["Edit Me"],
                "movies": ["Edit Me"]
            }
        };
        validProfiles.unshift(newProfile);
    }
});

// 5. Save
fs.writeFileSync(jsonPath, JSON.stringify(validProfiles, null, 4));
console.log(`\nSync verified. Total profiles: ${validProfiles.length}`);
