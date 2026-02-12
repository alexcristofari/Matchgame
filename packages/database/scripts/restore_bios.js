
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'funny_profiles.json');
let profiles = require(jsonPath);

// Data to restore/update based on user's lost edits in step 2842 & 2846 & 2852
const restorationData = {
    "Vitor Oliveira Vtx": {
        bio: "Hacker etico, sou a personificaçao das sombras nao gosto de pessoas pf nao me dirijam a palavra exceto mulheres, joguei lol por mt tempo e aprendi sobre o pior da humanidade, otp zed season 5, average singed enjoyer, atualmente estou aposentado do lol mas ainda faço trabalhos rs preço dm, tenho experiencia com comercio exterior (china) nao perguntar sobre, trabalhei algum tempo com renda fixa segura 'ntfs'(obrigado pvu), sou do rock, gosto de estudar sobre musculaçao e saude corporal, se vc for calistenico chega perto de mim nao",
        location: "Pacos de Ferreira, PT",
        gender: "male",
        interests: {
            games: ["League of Legends", "Axie Infinity", "Clair Obscur: Expedition 33"],
            music: ["Indie Nacional", "Metalcore", "Pop"],
            anime: ["Dragon Ball Z", "Black Clover"],
            movies: ["The Conjuring", "Supernatural", "Superstore"]
        }
    },
    // The user had "Vitor Oliveira (VTX)" in step 2846, but "Vitor Oliveira Vtx" in step 2842. 
    // The sync script generated "Vitor Oliveira Vtx" from filename "vitor_oliveira__vtx.png". I will target that name.

    "Lazaro": {
        // No custom bio found in history for Lazaro, keeping as is or placeholder
    },
    "Kanye West": {
        // No custom bio found in history
    },
    "Egirl": {
        // User added "E-Girl Padrão" with bio in step 2852, but filename is "egirl.jpg" -> "Egirl"
        // I will update "Egirl" to match "E-Girl Padrão" data if possible, or leave as Egirl
        // Waiting, step 2852 has "E-Girl Padrão" using "egirl.png", but my list has "egirl.jpg".
        // Let's check the file list again.
    },
    "Diddy": {
        // No custom bio found
    },
    "Erick Cabral (Bagra)": { // From step 2846
        bio: "herdeiro, fluente em 6 linguas, amante de musica e da setima arte, vi 1600 animes, souprodutor de musica e bato um league as vezes. :)",
        location: "São Paulo, SP",
        gender: "male",
        interests: {
            games: ["League of Legends", "Dota 2", "Remnant 2"],
            music: ["Metalcore", "Rock", "Pop"],
            anime: ["One Piece", "Naruto", "Attack on Titan", "Fullmetal Alchemist", "Steins;Gate"],
            movies: ["Pulp Fiction", "Interstellar", "The Godfather"]
        }
    },
    "Faria Limer": { // From step 2852
        bio: "Work hard, play hard. Crossfit as 5am. Beach Tennis fds. Copo Stanley na mão. NFT e Cripto. Mindset de crescimento.",
        location: "Itaim Bibi, SP",
        gender: "male",
        interests: {
            games: ["Axie Infinity", "The Sandbox", "FIFA 24"],
            music: ["Alok", "Vintage Culture"],
            movies: ["O Lobo de Wall Street", "Billions"]
        }
    }
    // ... add others if needed
};

// Also handle name changes if needed.
// The sync script creates names from filenames.
// "erick_cabral__bagra_.svg" -> "Erick Cabral  Bagra " roughly. 
// "faria_limer.svg" -> "Faria Limer"

profiles = profiles.map(p => {
    // Exact match restoration
    if (restorationData[p.name]) {
        return { ...p, ...restorationData[p.name] };
    }

    // Fuzzy/Filename based restoration
    // "Erick Cabral (Bagra)" might be "Erick Cabral  Bagra " in current JSON due to sync sanitize
    if (p.images[0].includes('erick_cabral__bagra_')) {
        return { ...p, name: "Erick Cabral (Bagra)", ...restorationData["Erick Cabral (Bagra)"] };
    }

    if (p.images[0].includes('faria_limer')) {
        return { ...p, name: "Faria Limer", ...restorationData["Faria Limer"] };
    }

    if (p.images[0].includes('egirl')) {
        // Check if user wanted "E-Girl Padrão"
        // In step 2852 user added "E-Girl Padrão" with "egirl.png". 
        // Current file might have "egirl.jpg" or "egirl.png".
        // If it is "egirl.jpg", sync creates "Egirl".
        // I will assume "Egirl" is the target.
        // Actually typically I should just let the user edit it, but they said "preciso q coloque os novos...".
        // Use "E-Girl Padrão" data?
        return {
            ...p,
            name: "E-Girl Padrão",
            bio: "Main Yuumi/Lux/Seraphine. Procuro duo pra me carregar.",
            location: "Discord",
            gender: "female",
            interests: {
                games: ["League of Legends", "Valorant", "Genshin Impact"],
                music: ["Doja Cat", "Melanie Martinez"],
                anime: ["Demon Slayer", "Spy x Family"]
            }
        };
    }

    return p;
});


fs.writeFileSync(jsonPath, JSON.stringify(profiles, null, 4));
console.log('✅ Restored missing bios and profiles.');
