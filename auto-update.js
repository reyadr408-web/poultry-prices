// Auto-update script for main website
// Loads data from Cloudflare KV and updates all pages

(async function() {
    try {
        // Load data from Cloudflare Worker
        const response = await fetch('/api/data');
        const data = await response.json();
        
        // Update poultry prices
        if (data.poultry && data.poultry.length > 0) {
            updatePoultryPrices(data.poultry);
        }
        
        // Update chicks companies
        if (data.chicksCompanies && data.chicksCompanies.length > 0) {
            updateChicksCompanies(data.chicksCompanies);
        }
        
        // Update feed companies (on homepage)
        if (data.feedCompanies && data.feedCompanies.length > 0) {
            updateFeedCompanies(data.feedCompanies);
        }
        
        // Update eggs
        if (data.eggs && data.eggs.length > 0) {
            updateEggsPrices(data.eggs);
        }
        
        // Update materials
        if (data.materials && data.materials.length > 0) {
            updateMaterialsPrices(data.materials);
        }
        
        console.log('✅ Website data updated from Cloudflare KV');
    } catch (error) {
        console.log('Using static data (Cloudflare KV not available):', error);
    }
})();

function updatePoultryPrices(poultry) {
    const tbody = document.querySelector('#poultry tbody');
    if (!tbody) return;
    
    tbody.innerHTML = poultry.map(item => {
        const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-');
        return `
        <tr onclick="window.location.href='poultry/${slug}.html'" style="cursor: pointer;">
            <td class="item-cell">
                <span class="item-icon">${item.icon || '🐔'}</span>
                <span class="item-name">${item.name}</span>
            </td>
            <td class="price-cell">
                <span class="price-badge blue">${item.priceAnnounced}</span>
                <span class="unit-text">جنيه/كيلو</span>
            </td>
            <td class="price-cell">
                <span class="price-badge green">${item.priceExecution}</span>
                <span class="unit-text">جنيه/كيلو</span>
            </td>
        </tr>
    `;}).join('');
}

function updateChicksCompanies(companies) {
    const tbody = document.querySelector('#chicks tbody');
    if (!tbody) return;
    
    // Get current date in DD/MM format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentDate = `${day}/${month}`;
    
    tbody.innerHTML = companies.map(item => {
        // Use slug if available, otherwise derive from name (remove 'كتكوت' prefix)
        const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-').replace(/كتكوت\s*/g, '');
        return `
        <tr onclick="window.location.href='chicks-details/${slug}-chick.html'" style="cursor: pointer;">
            <td class="item-cell">
                ${item.logo ? `<img src="${item.logo}" alt="${item.name}" style="width: 30px; height: 30px; border-radius: 6px; object-fit: contain; vertical-align: middle; margin-right: 8px;">` : '<span class="item-icon">🐣</span>'}
                <span class="item-name">${item.name.includes('كتكوت') ? item.name : 'كتكوت ' + item.name}</span>
            </td>
            <td class="price-cell">
                <span class="price-badge teal">${item.price}</span>
            </td>
            <td class="price-cell">
                <span style="color: #6b7280; font-size: 14px;">${currentDate}</span>
            </td>
        </tr>
    `;}).join('');
}

function updateFeedCompanies(companies) {
    const feedContainer = document.querySelector('#feed > div');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = companies.map(item => {
        const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-').replace(/علف\s*/g, '');
        return `
        <div onclick="window.location.href='feed-details/${slug}-feed.html'" style="cursor: pointer; background: white; padding: 15px; border-radius: 10px; border: 1px solid #e5e7eb;">
            <h3 style="color: #374151; font-size: 18px; margin-bottom: 12px; font-weight: 600; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                ${item.logo ? `<img src="${item.logo}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: contain;">` : ''}
                علف ${item.name}
            </h3>
            <div style="display: flex; gap: 8px; justify-content: space-between;">
                <div style="text-align: center; padding: 10px; flex: 1;">
                    <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">بادي 23%</div>
                    <div style="color: #111827; font-weight: 700; font-size: 17px;">${item.bady23}</div>
                </div>
                <div style="width: 2px; background: #e5e7eb;"></div>
                <div style="text-align: center; padding: 10px; flex: 1;">
                    <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">نامي 21%</div>
                    <div style="color: #111827; font-weight: 700; font-size: 17px;">${item.namy21}</div>
                </div>
                <div style="width: 2px; background: #e5e7eb;"></div>
                <div style="text-align: center; padding: 10px; flex: 1;">
                    <div style="color: #1f2937; font-weight: 600; font-size: 15px; margin-bottom: 8px;">ناهي 19%</div>
                    <div style="color: #111827; font-weight: 700; font-size: 17px;">${item.nahy19}</div>
                </div>
            </div>
        </div>
    `;}).join('');
}

function updateEggsPrices(eggs) {
    const tbody = document.querySelector('#eggs tbody');
    if (!tbody) return;
    
    tbody.innerHTML = eggs.map(item => {
        const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-').replace(/بيض\s*/g, '');
        return `
        <tr onclick="window.location.href='eggs-details/${slug}-eggs.html'" style="cursor: pointer;">
            <td class="item-cell">
                <span class="item-icon">🥚</span>
                <span class="item-name">${item.name}</span>
            </td>
            <td class="price-cell">
                <span class="price-badge ${item.name.includes('أبيض') ? 'blue' : item.name.includes('أحمر') ? 'brown' : 'teal'}">${item.price}</span>
            </td>
        </tr>
    `;}).join('');
}

function updateMaterialsPrices(materials) {
    // Find materials table - works in both index.html and materials.html
    const materialsSection = document.querySelector('#materials');
    if (!materialsSection) return;
    
    const tbody = materialsSection.querySelector('table.prices-table tbody');
    if (!tbody) return;
    
    // Get current date in DD/MM format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentDate = `${day}/${month}`;
    
    tbody.innerHTML = materials.map(item => {
        const slug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-');
        return `
        <tr onclick="window.location.href='materials-details/${slug}.html'" style="cursor: pointer;">
            <td class="item-cell">
                <span class="item-icon">${item.icon || '🌾'}</span>
                <span class="item-name">${item.name}</span>
            </td>
            <td class="price-cell">
                <span class="price-badge orange">${item.price}</span>
            </td>
            <td class="price-cell">
                <span style="color: #6b7280; font-size: 14px;">${currentDate}</span>
            </td>
        </tr>
    `;}).join('');
}
