
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'funny_profiles.json');
const profiles = require(p);

const newProfiles = [
    {
        "name": "Lula",
        "email": "lula.star@matchgame.dev",
        "age": 78,
        "bio": "Companheiro! Picanha e cervejinha para todos. O amor venceu. Gosto de viajar de avião (com ou sem caneta).",
        "location": "Brasília, DF",
        "gender": "male",
        "images": [
            "https://upload.wikimedia.org/wikipedia/dummy_lula.jpg"
        ],
        "interests": {
            "games": [
                "SimCity",
                "Tropico 6"
            ],
            "music": [
                "Chico Buarque",
                "Gilberto Gil"
            ],
            "movies": [
                "Central do Brasil",
                "Bacurau"
            ]
        }
    },
    {
        "name": "Jair Bolsonaro",
        "email": "mito.capitao@matchgame.dev",
        "age": 69,
        "bio": "Brasil acima de tudo, Deus acima de todos. Talkey? Histórico de atleta. Imorrível, imbrochável, incomível.",
        "location": "Orlando, FL",
        "gender": "male",
        "images": [
            "https://upload.wikimedia.org/wikipedia/dummy_bolsonaro.jpg"
        ],
        "interests": {
            "games": [
                "Call of Duty",
                "Sniper Elite"
            ],
            "music": [
                "Sertanejo Universitário",
                "Hino Nacional"
            ],
            "movies": [
                "Tropa de Elite",
                "O Patriota"
            ]
        }
    },
    {
        "name": "Charlie Kirk",
        "email": "small.face@matchgame.dev",
        "age": 30,
        "bio": "Turning Point USA. Facts don't care about your feelings. Minha cara é tamanho normal, ok?",
        "location": "USA",
        "gender": "male",
        "images": [
            "https://upload.wikimedia.org/wikipedia/dummy_kirk.jpg"
        ],
        "interests": {
            "games": [
                "Debate Simulator",
                "Among Us"
            ],
            "music": [
                "Country"
            ],
            "movies": [
                "God's Not Dead"
            ]
        }
    },
    {
        "name": "Cachorro Chupetao",
        "email": "chupetao@matchgame.dev",
        "age": 5,
        "bio": "Ooiii gente! Tudo bem com vocês? Eu sou um cachorrinho muito fofinho. Gosto de chupar chupeta e brincar.",
        "location": "Mundo da Internet",
        "gender": "male",
        "images": [
            "https://upload.wikimedia.org/wikipedia/dummy_chupetao.jpg"
        ],
        "interests": {
            "games": [
                "Nintendogs",
                "Paw Patrol"
            ],
            "music": [
                "Músicas Infantis"
            ],
            "movies": [
                "Bolt",
                "Scooby-Doo"
            ]
        }
    }
];

// Combine and remove duplicates just in case
let finalProfiles = [...profiles];
newProfiles.forEach(newP => {
    // Remove if exists
    finalProfiles = finalProfiles.filter(p => p.name !== newP.name);
    // Add new
    finalProfiles.unshift(newP); // Add to top to see immediately
});

fs.writeFileSync(p, JSON.stringify(finalProfiles, null, 4));
console.log(`Added/Updated ${newProfiles.length} profiles.`);
