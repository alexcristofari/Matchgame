
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'funny_profiles.json');
const avatarsDir = path.join(__dirname, '../../apps/web/public/avatars');

let profiles = require(jsonPath);

// 1. Remove unwanted profiles
const unwanted = ['Dwight Schrute', 'J.K. Rowling'];
profiles = profiles.filter(p => !unwanted.includes(p.name));

// 2. Restore Bios and Data
const restorations = {
    'Charlie Kirk': {
        bio: "WE ARE CHARLIE KIRK"
    },
    'Cachorro Chupetao': {
        bio: "TUC TUC TUC TUC"
    },
    'Michael Scott': {
        bio: "Foi o que ela disse"
    },
    'Oppenheimer': {
        bio: "NO FUCKING FIGHTING!, ops filme errado"
    },
    'Lucas Inutilsmo': {
        bio: "Esse ano nao vai ter retrospectiva fellas",
        interests: {
            games: ["League of Legends"]
        }
    },
    'Esqueleto': {
        bio: "AQUI E ROCK PORRA SE VC N CURTE ROCK SAI DA MINHA FRENTE"
    },
    'Lula': {
        bio: "Companheiro! Picanha e cervejinha para todos. O amor venceu."
    },
    'Vitor Oliveira Vtx': {
        bio: "Hacker etico, sou a personificaçao das sombras nao gosto de pessoas pf nao me dirijam a palavra exceto mulheres, joguei lol por mt tempo e aprendi sobre o pior da humanidade, otp zed season 5, average singed enjoyer, atualmente estou aposentado do lol mas ainda faço trabalhos rs preço dm, tenho experiencia com comercio exterior (china) nao perguntar sobre, trabalhei algum tempo com renda fixa segura 'ntfs'(obrigado pvu), sou do rock, gosto de estudar sobre musculaçao e saude corporal, se vc for calistenico chega perto de mim nao",
        location: "Pacos de Ferreira, PT",
        interests: {
            games: ["League of Legends", "Axie Infinity", "Clair Obscur: Expedition 33"]
        }
    }
};

profiles.forEach(p => {
    if (restorations[p.name]) {
        if (restorations[p.name].bio) p.bio = restorations[p.name].bio;
        if (restorations[p.name].location) p.location = restorations[p.name].location;
        if (restorations[p.name].interests) {
            p.interests = { ...p.interests, ...restorations[p.name].interests };
        }
    }
});

// 3. Save JSON
fs.writeFileSync(jsonPath, JSON.stringify(profiles, null, 4));
console.log('✅ JSON Fixed and Restored.');

// 4. Force Delete Files
const filesToDelete = ['dwight_schrute.jpg', 'j_k__rowling.jpg'];
filesToDelete.forEach(f => {
    const p = path.join(avatarsDir, f);
    if (fs.existsSync(p)) {
        try {
            fs.unlinkSync(p);
            console.log(`🗑️ Deleted ${f}`);
        } catch (e) {
            console.error(`❌ Failed to delete ${f}: ${e.message}`);
        }
    }
});
