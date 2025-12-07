// Auto-update script for main website
// Loads data from Cloudflare KV and updates all pages

(async function() {
    // Add loading class to hide prices during update
    document.body.classList.add('prices-loading');
    
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
    } finally {
        // Remove loading class to show updated prices
        document.body.classList.remove('prices-loading');
    }
})();

function updatePoultryPrices(poultry) {
    const tbody = document.querySelector('#poultry tbody');
    if (!tbody) return;
    
    // Update only prices, keep HTML structure and onclick handlers
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index < poultry.length) {
            const item = poultry[index];
            const priceCells = row.querySelectorAll('.price-badge');
            if (priceCells.length >= 2) {
                priceCells[0].textContent = item.priceAnnounced;
                priceCells[1].textContent = item.priceExecution;
            }
        }
    });
}

function updateChicksCompanies(companies) {
    const tbody = document.querySelector('#chicks tbody');
    if (!tbody) return;
    
    // Get current date in DD/MM format
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const currentDate = `${day}/${month}`;
    
    // Update only prices and dates, keep HTML structure and onclick handlers
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index < companies.length) {
            const item = companies[index];
            const priceBadge = row.querySelector('.price-badge');
            if (priceBadge) {
                priceBadge.textContent = item.price;
            }
            // Update date in third td
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const dateSpan = cells[2].querySelector('span');
                if (dateSpan) {
                    dateSpan.textContent = currentDate;
                }
            }
        }
    });
}

function updateFeedCompanies(companies) {
    const feedContainer = document.querySelector('#feed > div');
    if (!feedContainer) return;
    
    // Update only prices, keep HTML structure and onclick handlers
    const feedCards = feedContainer.querySelectorAll('div[onclick]');
    feedCards.forEach((card, index) => {
        if (index < companies.length) {
            const item = companies[index];
            const pricesDivs = card.querySelectorAll('div[style*="font-size: 17px"]');
            if (pricesDivs.length >= 3) {
                pricesDivs[0].textContent = item.bady23;
                pricesDivs[1].textContent = item.namy21;
                pricesDivs[2].textContent = item.nahy19;
            }
        }
    });
}

function updateEggsPrices(eggs) {
    const tbody = document.querySelector('#eggs tbody');
    if (!tbody) return;
    
    // Update only prices, keep HTML structure and onclick handlers
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index < eggs.length) {
            const item = eggs[index];
            const priceBadge = row.querySelector('.price-badge');
            if (priceBadge) {
                priceBadge.textContent = item.price;
            }
        }
    });
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
    
    // Update only prices and dates, keep HTML structure and onclick handlers
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index < materials.length) {
            const item = materials[index];
            const priceBadge = row.querySelector('.price-badge');
            if (priceBadge) {
                priceBadge.textContent = item.price;
            }
            // Update date in third td
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const dateSpan = cells[2].querySelector('span');
                if (dateSpan) {
                    dateSpan.textContent = currentDate;
                }
            }
        }
    });
}
