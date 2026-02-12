
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'funny_profiles.json');
let profiles = require(jsonPath);

// Sort alphabetically by name
profiles.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(jsonPath, JSON.stringify(profiles, null, 4));
console.log(`✅ Sorted ${profiles.length} profiles alphabetically.`);
