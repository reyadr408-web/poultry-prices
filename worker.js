// Cloudflare Worker for handling data storage
// Deploy this at: https://dash.cloudflare.com/workers

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET: Load data
    if (request.method === 'GET' && url.pathname === '/api/data') {
      try {
        const data = await env.POULTRY_DATA.get('full-data', { type: 'json' });
        
        if (!data) {
          // Return default data if not found
          return new Response(JSON.stringify({
            lastUpdate: new Date().toISOString(),
            poultry: [],
            chicksCompanies: [],
            feedCompanies: [],
            eggs: [],
            materials: []
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // POST: Save data
    if (request.method === 'POST' && url.pathname === '/api/data') {
      try {
        const data = await request.json();
        data.lastUpdate = new Date().toISOString();
        
        // Save to KV storage
        await env.POULTRY_DATA.put('full-data', JSON.stringify(data));
        
        // Create backup
        const backupKey = `backup-${Date.now()}`;
        await env.POULTRY_DATA.put(backupKey, JSON.stringify(data), {
          expirationTtl: 604800 // Keep backups for 7 days
        });
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Data saved successfully',
          timestamp: data.lastUpdate
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // 404 for other routes
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};
