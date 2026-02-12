
async function testProxy() {
    const proxyUrl = 'http://localhost:3001/api/proxy/image';
    const targetImage = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bagra';
    const fullUrl = `${proxyUrl}?url=${encodeURIComponent(targetImage)}`;

    console.log(`Testing proxy at: ${fullUrl}`);

    try {
        const response = await fetch(fullUrl);
        console.log(`Status: ${response.status}`);
        console.log(`Content-Type: ${response.headers.get('content-type')}`);

        if (response.ok) {
            const blob = await response.blob();
            console.log(`Data Size: ${blob.size} bytes`);
            console.log('✅ Proxy working!');
        } else {
            console.log('❌ Proxy failed');
            console.log(await response.text());
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testProxy();
