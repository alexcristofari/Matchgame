
import { SteamService } from './apps/backend/src/modules/integrations/steam.service';

async function test() {
    try {
        console.log('Testing Steam Store Search...');
        const results = await SteamService.searchStore('Counter');
        console.log('Results:', results.length);
        console.log(results[0]);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
