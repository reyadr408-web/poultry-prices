// Auto-update script for detail pages
// Updates individual company/item pages from Cloudflare KV data

(async function() {
    try {
        // Get the current page company/item name from URL or page
        const pageUrl = window.location.pathname;
        
        // Determine page type and get item identifier
        let pageType = null;
        let itemIdentifier = null;
        
        if (pageUrl.includes('chicks-details/')) {
            pageType = 'chick';
            itemIdentifier = getChickIdentifier(pageUrl);
        } else if (pageUrl.includes('poultry/')) {
            pageType = 'poultry';
            itemIdentifier = getPoultryIdentifier(pageUrl);
        } else if (pageUrl.includes('eggs-details/')) {
            pageType = 'egg';
            itemIdentifier = getEggIdentifier(pageUrl);
        } else if (pageUrl.includes('feed-details/')) {
            pageType = 'feed';
            itemIdentifier = getFeedIdentifier(pageUrl);
        } else if (pageUrl.includes('materials-details/')) {
            pageType = 'material';
            itemIdentifier = getMaterialIdentifier(pageUrl);
        }
        
        if (!pageType || !itemIdentifier) {
            console.log('Could not identify page type or item');
            return;
        }
        
        // Load data from Cloudflare Worker
        const response = await fetch('/api/data');
        const data = await response.json();
        
        // Update prices based on page type
        switch(pageType) {
            case 'chick':
                updateChickDetailPage(data.chicksCompanies, itemIdentifier);
                break;
            case 'poultry':
                updatePoultryDetailPage(data.poultry, itemIdentifier);
                break;
            case 'egg':
                updateEggDetailPage(data.eggs, itemIdentifier);
                break;
            case 'feed':
                updateFeedDetailPage(data.feedCompanies, itemIdentifier);
                break;
            case 'material':
                updateMaterialDetailPage(data.materials, itemIdentifier);
                break;
        }
        
        console.log(`✅ Detail page updated: ${pageType} - ${itemIdentifier}`);
    } catch (error) {
        console.log('Using static data (Cloudflare KV not available):', error);
    }
})();

// Helper functions to identify items from URL
function getChickIdentifier(url) {
    const filename = url.split('/').pop().replace('.html', '');
    const identifierMap = {
        'wadi-chick': 'الوادي',
        'watania-chick': 'الوطنية',
        'dakahlia-chick': 'الدقهلية',
        'cairo-chick': 'القاهرة',
        'cairo3a-chick': 'كايرو ثرى اى',
        'delta-chick': 'دلتا مصر',
        'amat-chick': 'امات',
        'shrouk-chick': 'الشروق',
        'samy-chick': 'سامي عياد',
        'ramadan-chick': 'رمضان فكرى',
        'tasgeen-chick': 'التسعين',
        'abrar-chick': 'الابرار',
        'qasaby-chick': 'القصبي',
        'sasso-chick': 'كتكوت ساسو',
        'white-chick': 'كتكوت أبيض أهالي',
        'newgen-chick': 'نيوجن'
    };
    return identifierMap[filename];
}

function getPoultryIdentifier(url) {
    const filename = url.split('/').pop().replace('.html', '');
    const identifierMap = {
        'white-chicken': 'فراخ بيضاء',
        'sasso-chicken': 'فراخ ساسو',
        'baladi-chicken': 'دجاج بلدي',
        'mothers-chicken': 'أمهات',
        'white-turkey': 'رومي أبيض',
        'black-turkey': 'رومي أسود',
        'muscovy-duck': 'بط مسكوفي',
        'molar-duck': 'بط مولر',
        'french-duck': 'بط فرنساوي',
        'quail': 'سمان'
    };
    return identifierMap[filename];
}

function getEggIdentifier(url) {
    const filename = url.split('/').pop().replace('.html', '');
    const identifierMap = {
        'white-eggs': 'بيض أبيض',
        'red-eggs': 'بيض أحمر',
        'baladi-eggs': 'بيض بلدي'
    };
    return identifierMap[filename];
}

function getFeedIdentifier(url) {
    const filename = url.split('/').pop().replace('.html', '');
    const identifierMap = {
        'cairo-feed': 'القاهرة',
        'dakahlia-feed': 'الدقهلية',
        'alwatania-feed': 'الوطنية',
        'egypt-feed': 'مصر',
        'misr-feed': 'مصر للأعلاف',
        'newhope-feed': 'نيوهوب',
        'haida-feed': 'هيدة',
        'veto-feed': 'فيتو',
        'teba-feed': 'طيبة',
        'soha-feed': 'سها',
        'rashid-feed': 'رشيد',
        'abostate-feed': 'أبو سته',
        'alamal-feed': 'الأمل',
        'almogy-feed': 'المجي'
    };
    return identifierMap[filename];
}

function getMaterialIdentifier(url) {
    const filename = url.split('/').pop().replace('.html', '');
    const identifierMap = {
        'corn': 'ذرة صفراء',
        'soybean-meal': 'كسب فول الصويا',
        'soybean': 'فول صويا',
        'bran': 'نخالة قمح',
        'wheat': 'قمح',
        'sunflower-meal': 'كسب عباد الشمس',
        'rice-bran': 'رجيع الكون',
        'limestone': 'حجر جيري',
        'phosphate': 'فوسفات',
        'salt': 'ملح',
        'methionine': 'ميثيونين',
        'premix': 'بريمكس'
    };
    return identifierMap[filename];
}

// Update functions for each page type

function updateChickDetailPage(chicksData, identifier) {
    if (!chicksData) return;
    
    const item = chicksData.find(c => 
        c.name === identifier || 
        c.name.includes(identifier) ||
        identifier.includes(c.name)
    );
    
    if (!item) {
        console.log(`Chick not found: ${identifier}`);
        return;
    }
    
    // Update price if element exists
    const priceElement = document.getElementById('priceAnnounced') || 
                         document.querySelector('.price-badge.blue');
    if (priceElement) {
        priceElement.textContent = item.price || item.priceAnnounced || '0';
    }
    
    // Some chick pages might have execution price
    const executionElement = document.getElementById('priceExecution') ||
                            document.querySelector('.price-badge.green');
    if (executionElement && item.priceExecution) {
        executionElement.textContent = item.priceExecution;
    }
}

function updatePoultryDetailPage(poultryData, identifier) {
    if (!poultryData) return;
    
    const item = poultryData.find(p => 
        p.name === identifier || 
        p.name.includes(identifier) ||
        identifier.includes(p.name)
    );
    
    if (!item) {
        console.log(`Poultry not found: ${identifier}`);
        return;
    }
    
    // Update announced price
    const announcedElement = document.getElementById('priceAnnounced') ||
                            document.querySelector('.price-badge.blue');
    if (announcedElement) {
        announcedElement.textContent = item.priceAnnounced || '0';
    }
    
    // Update execution price
    const executionElement = document.getElementById('priceExecution') ||
                            document.querySelector('.price-badge.green');
    if (executionElement) {
        executionElement.textContent = item.priceExecution || '0';
    }
}

function updateEggDetailPage(eggsData, identifier) {
    if (!eggsData) return;
    
    const item = eggsData.find(e => 
        e.name === identifier || 
        e.name.includes(identifier) ||
        identifier.includes(e.name)
    );
    
    if (!item) {
        console.log(`Egg not found: ${identifier}`);
        return;
    }
    
    // Update price
    const priceElement = document.getElementById('price') ||
                        document.querySelector('.price-badge');
    if (priceElement) {
        priceElement.textContent = item.price || '0';
    }
}

function updateFeedDetailPage(feedData, identifier) {
    if (!feedData) return;
    
    const item = feedData.find(f => 
        f.name === identifier || 
        f.name.includes(identifier) ||
        identifier.includes(f.name)
    );
    
    if (!item) {
        console.log(`Feed not found: ${identifier}`);
        return;
    }
    
    // Update bady23
    const bady23Element = document.getElementById('bady23') ||
                         document.querySelector('[data-feed="bady23"]');
    if (bady23Element) {
        bady23Element.textContent = item.bady23 || '0';
    }
    
    // Update namy21
    const namy21Element = document.getElementById('namy21') ||
                         document.querySelector('[data-feed="namy21"]');
    if (namy21Element) {
        namy21Element.textContent = item.namy21 || '0';
    }
    
    // Update nahy19
    const nahy19Element = document.getElementById('nahy19') ||
                         document.querySelector('[data-feed="nahy19"]');
    if (nahy19Element) {
        nahy19Element.textContent = item.nahy19 || '0';
    }
}

function updateMaterialDetailPage(materialsData, identifier) {
    if (!materialsData) return;
    
    const item = materialsData.find(m => 
        m.name === identifier || 
        m.name.includes(identifier) ||
        identifier.includes(m.name)
    );
    
    if (!item) {
        console.log(`Material not found: ${identifier}`);
        return;
    }
    
    // Update price
    const priceElement = document.getElementById('price') ||
                        document.querySelector('.price-badge.orange');
    if (priceElement) {
        priceElement.textContent = item.price || '0';
    }
}
