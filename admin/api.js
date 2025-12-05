// Cloudflare KV Storage API
// Replace YOUR_ACCOUNT_ID and YOUR_API_TOKEN after deployment

const CONFIG = {
    KV_NAMESPACE_ID: 'YOUR_KV_NAMESPACE_ID', // سيتم تحديثه بعد إنشاء KV
    API_ENDPOINT: '/api/data' // Cloudflare Worker endpoint
};

// Save data to Cloudflare KV
async function saveToCloudflare(data) {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving to Cloudflare:', error);
        throw error;
    }
}

// Load data from Cloudflare KV
async function loadFromCloudflare() {
    try {
        const response = await fetch(CONFIG.API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading from Cloudflare:', error);
        throw error;
    }
}

// Export functions
window.CloudflareAPI = {
    save: saveToCloudflare,
    load: loadFromCloudflare
};
