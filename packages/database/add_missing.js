
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'funny_profiles.json');
const avatarsDir = path.join(__dirname, '../../apps/web/public/avatars');

let profiles = require(jsonPath);
const files = fs.readdirSync(avatarsDir);

// Sanitize helper
const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

// Map existing profiles by image filename for easy lookup
const existingImages = new Set();
profiles.forEach(p => {
    if (p.images && p.images.length > 0) {
        existingImages.add(path.basename(p.images[0]));
    }
});

// Profiles data to restore
const restorations = {
    "diddy.png": {
        name: "Diddy",
        bio: "New profile for Diddy. Edit this bio in funny_profiles.json"
    },
    "kanye_west.jpg": {
        name: "Kanye West",
        bio: "New profile for Kanye West. Edit this bio in funny_profiles.json"
    },
    "lazaro.jpg": {
        name: "Lazaro",
        bio: "New profile for Lazaro. Edit this bio in funny_profiles.json"
    },
    "egirl.jpg": { // Or egirl.png, checking file list
        name: "E-Girl Padrão",
        bio: "Main Yuumi/Lux/Seraphine. Procuro duo pra me carregar.",
        gender: "female",
        location: "Discord",
        interests: {
            games: ["League of Legends", "Valorant", "Genshin Impact"],
            music: ["Doja Cat", "Melanie Martinez"],
            anime: ["Demon Slayer", "Spy x Family"]
        }
    },
    "egirl.png": { // Backup if it is png
        name: "E-Girl Padrão",
        bio: "Main Yuumi/Lux/Seraphine. Procuro duo pra me carregar.",
        gender: "female",
        location: "Discord",
        interests: {
            games: ["League of Legends", "Valorant", "Genshin Impact"],
            music: ["Doja Cat", "Melanie Martinez"],
            anime: ["Demon Slayer", "Spy x Family"]
        }
    },
    "faria_limer.svg": {
        name: "Faria Limer",
        bio: "Work hard, play hard. Crossfit as 5am. Beach Tennis fds. Copo Stanley na mão. NFT e Cripto. Mindset de crescimento.",
        gender: "male",
        location: "Itaim Bibi, SP",
        interests: {
            games: ["Axie Infinity", "The Sandbox", "FIFA 24"],
            music: ["Alok", "Vintage Culture"],
            movies: ["O Lobo de Wall Street", "Billions"]
        }
    },
    "erick_cabral__bagra_.svg": {
        name: "Erick Cabral (Bagra)",
        bio: "herdeiro, fluente em 6 linguas, amante de musica e da setima arte, vi 1600 animes, souprodutor de musica e bato um league as vezes. :)",
        gender: "male",
        location: "São Paulo, SP",
        interests: {
            games: ["League of Legends", "Dota 2", "Remnant 2"],
            music: ["Metalcore", "Rock", "Pop"],
            anime: ["One Piece", "Naruto", "Attack on Titan", "Fullmetal Alchemist", "Steins;Gate"],
            movies: ["Pulp Fiction", "Interstellar", "The Godfather"]
        }
    }
};

let addedCount = 0;

files.forEach(f => {
    if (!existingImages.has(f)) {
        console.log(`✨ Restoring missing profile for: ${f}`);

        let newProfile = {};

        // Use restored data if available
        if (restorations[f]) {
            newProfile = {
                name: restorations[f].name,
                email: `${path.parse(f).name}@matchgame.dev`, // Simplified
                age: 25,
                bio: restorations[f].bio,
                location: restorations[f].location || "Unknown",
                gender: restorations[f].gender || "unknown",
                images: [`/avatars/${f}`],
                interests: restorations[f].interests || {
                    games: ["Edit Me"],
                    music: ["Edit Me"],
                    movies: ["Edit Me"]
                }
            };
        } else {
            // Generic fallback
            const namePart = path.parse(f).name;
            const displayName = namePart.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            newProfile = {
                name: displayName,
                email: `${namePart}@matchgame.dev`,
                age: 25,
                bio: `New profile for ${displayName}. Edit this bio in funny_profiles.json`,
                location: "Unknown",
                gender: "unknown",
                images: [`/avatars/${f}`],
                interests: {
                    games: ["Edit Me"],
                    music: ["Edit Me"],
                    movies: ["Edit Me"]
                }
            };
        }

        profiles.push(newProfile);
        addedCount++;
    }
});

if (addedCount > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(profiles, null, 4));
    console.log(`✅ Added ${addedCount} missing profiles to JSON.`);
} else {
    console.log("No missing profiles found based on file list.");
}
