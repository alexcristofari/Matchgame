
const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'funny_profiles.json');
const profiles = require(p);

const updates = {
    "Jeffrey Epstein": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeffrey_Epstein_mugshot.jpg/320px-Jeffrey_Epstein_mugshot.jpg",
    "Michael Scott": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Steve_Carell_November_2014.jpg/320px-Steve_Carell_November_2014.jpg",
    "Dwight Schrute": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Rainn_Wilson_2011_Shankbone.JPG/320px-Rainn_Wilson_2011_Shankbone.JPG",
    "Wednesday Addams": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Jenna_Ortega_at_SDCC_2022.jpg/320px-Jenna_Ortega_at_SDCC_2022.jpg",
    "Barbie": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Margot_Robbie_at_the_2019_Cannes_Film_Festival.jpg/320px-Margot_Robbie_at_the_2019_Cannes_Film_Festival.jpg",
    "Oppenheimer": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg/320px-Cillian_Murphy_Press_Conference_The_Party_Berlinale_2017_02cr.jpg",
    "Patrick Bateman": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Christian_Bale-7837.jpg/320px-Christian_Bale-7837.jpg",
    "Geralt de Rívia": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Henry_Cavill_by_Gage_Skidmore.jpg/320px-Henry_Cavill_by_Gage_Skidmore.jpg",
    "Ana de Armas (Blade Runner Vers.)": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ana_de_Armas_at_the_2020_Golden_Globe_Awards.jpg/320px-Ana_de_Armas_at_the_2020_Golden_Globe_Awards.jpg"
};

let count = 0;
profiles.forEach(profile => {
    if (updates[profile.name]) {
        profile.images = [updates[profile.name]];
        console.log(`Updated ${profile.name}`);
        count++;
    }
});

fs.writeFileSync(p, JSON.stringify(profiles, null, 4));
console.log(`Saved ${count} updates to funny_profiles.json`);
