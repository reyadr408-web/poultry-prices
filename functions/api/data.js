// Cloudflare Pages Function for API
// File: functions/api/data.js

export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const data = await context.env.POULTRY_DATA.get('full-data', { type: 'json' });
    
    if (!data) {
      // Return default empty data
      return new Response(JSON.stringify({
        lastUpdate: new Date().toISOString(),
        poultry: [],
        chicksCompanies: [],
        feedCompanies: [],
        eggs: [],
        materials: []
      }), { headers: corsHeaders });
    }
    
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const data = await context.request.json();
    data.lastUpdate = new Date().toISOString();
    
    // Save to KV
    await context.env.POULTRY_DATA.put('full-data', JSON.stringify(data));
    
    // Create backup
    const backupKey = `backup-${Date.now()}`;
    await context.env.POULTRY_DATA.put(backupKey, JSON.stringify(data), {
      expirationTtl: 604800 // 7 days
    });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Data saved successfully',
      timestamp: data.lastUpdate
    }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
