
const axios = require('axios');
const fs = require('fs');

async function testProxy() {
    const proxyUrl = 'http://localhost:3001/api/proxy/image';
    const targetImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bagra';

    try {
        console.log(`Testing proxy at: ${proxyUrl}`);
        console.log(`Target: ${targetImage}`);

        const response = await axios.get(proxyUrl, {
            params: { url: targetImage },
            responseType: 'arraybuffer' // Get raw data
        });

        console.log(`Status: ${response.status}`);
        console.log(`Content-Type: ${response.headers['content-type']}`);
        console.log(`Data Length: ${response.data.length} bytes`);

        // Save to verify it's a valid image
        fs.writeFileSync('proxy_test_output.svg', response.data);
        console.log('Saved response to proxy_test_output.svg');

    } catch (error) {
        if (error.response) {
            console.error(`Error Status: ${error.response.status}`);
            console.error(`Error Data: ${error.response.data.toString()}`);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testProxy();
