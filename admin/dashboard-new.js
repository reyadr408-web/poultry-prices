// Dashboard Management System for Poultry Market Website
let fullData = null;
let currentEditIndex = null;
let currentEditCategory = null;
let hasUnsavedChanges = false;

// Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFullData();
});

// Logout function
function logout() {
    if (hasUnsavedChanges) {
        if (!confirm('لديك تغييرات غير محفوظة. هل تريد الخروج؟')) {
            return;
        }
    }
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}

// Load data from Cloudflare KV or local JSON
async function loadFullData() {
    try {
        // Try loading from Cloudflare KV first
        const response = await fetch('/api/data');
        if (response.ok) {
            fullData = await response.json();
            console.log('✅ Data loaded from Cloudflare KV');
            updateDashboard();
            renderAllTables();
            return;
        }
    } catch (error) {
        console.log('Cloudflare KV not available, trying local file...');
    }
    
    try {
        // Fallback to local JSON file
        const response = await fetch('./full-data.json');
        fullData = await response.json();
        console.log('✅ Data loaded from local JSON');
        updateDashboard();
        renderAllTables();
    } catch (error) {
        // Last fallback: Load embedded data
        console.log('Loading embedded data as fallback');
        fullData = getEmbeddedData();
        updateDashboard();
        renderAllTables();
    }
}

// Embedded data for local testing
function getEmbeddedData() {
    return {
  "lastUpdate": "2025-12-05T12:00:00",
  "poultry": [
    {"name": "فراخ بيضاء", "priceAnnounced": "60", "priceExecution": "58", "icon": "🐔"},
    {"name": "فراخ ساسو", "priceAnnounced": "85", "priceExecution": "83", "icon": "🐔"},
    {"name": "الأمهات", "priceAnnounced": "77", "priceExecution": "75", "icon": "🐔"},
    {"name": "بلدي", "priceAnnounced": "92", "priceExecution": "90", "icon": "🐔"},
    {"name": "رومي أبيض", "priceAnnounced": "97", "priceExecution": "95", "icon": "🦃"},
    {"name": "رومي أسود", "priceAnnounced": "100", "priceExecution": "98", "icon": "🦃"},
    {"name": "بط مسكوفي", "priceAnnounced": "70", "priceExecution": "68", "icon": "🦆"},
    {"name": "بط مولر", "priceAnnounced": "65", "priceExecution": "63", "icon": "🦆"},
    {"name": "بط فرنساوي", "priceAnnounced": "68", "priceExecution": "66", "icon": "🦆"},
    {"name": "سمان", "priceAnnounced": "55", "priceExecution": "53", "icon": "🐦"}
  ],
  "chicksCompanies": [
    {"name": "كتكوت ساسو", "logo": null, "price": "12.5"},
    {"name": "كتكوت أبيض أهالي", "logo": null, "price": "10.5"},
    {"name": "الوادى", "logo": "wadi-chicks-logo.png", "price": "12.5"},
    {"name": "الوطنية", "logo": "watane-logo.png", "price": "12.3"},
    {"name": "الدقهلية", "logo": "daka-logo.png", "price": "12.4"},
    {"name": "امات", "logo": "amat-logo.png", "price": "12.0"},
    {"name": "كايرو ثرى اى", "logo": "cairo-logo.png", "price": "11.8"},
    {"name": "القاهرة", "logo": "cpc-logo.png", "price": "12.2"},
    {"name": "دلتا مصر", "logo": "delta-logo.png", "price": "12.1"},
    {"name": "رمضان فكرى", "logo": "ramadan-logo.png", "price": "11.9"},
    {"name": "الشروق", "logo": "shrouk-logo.png", "price": "12.3"},
    {"name": "سامي عياد", "logo": "samy-logo.png", "price": "12.4"},
    {"name": "التسعين", "logo": "99-logo.png", "price": "12.2"},
    {"name": "الابرار", "logo": "abrar-logo.png", "price": "12.1"},
    {"name": "القصبي", "logo": "qasaby-logo.png", "price": "12.0"}
  ],
  "feedCompanies": [
    {"name": "نيو هوب", "logo": "newhope-logo.png", "bady23": "16800", "namy21": "15500", "nahy19": "14800"},
    {"name": "هايدا", "logo": "haida-logo.png", "bady23": "16500", "namy21": "15300", "nahy19": "14600"},
    {"name": "الدقهلية", "logo": "daqahliya-logo.png", "bady23": "16900", "namy21": "15700", "nahy19": "14900"},
    {"name": "الايمان", "logo": "eman-logo.png", "bady23": "16700", "namy21": "15400", "nahy19": "14700"},
    {"name": "القائد", "logo": "qaed-logo.png", "bady23": "16600", "namy21": "15600", "nahy19": "14750"},
    {"name": "الاهرام", "logo": "ahram-logo.png", "bady23": "16850", "namy21": "15550", "nahy19": "14850"},
    {"name": "الفتح", "logo": "fath-logo.png", "bady23": "16750", "namy21": "15450", "nahy19": "14650"},
    {"name": "الوادى", "logo": "wadi-logo.png", "bady23": "16800", "namy21": "15500", "nahy19": "14700"},
    {"name": "نوفافيد", "logo": "nova-logo.png", "bady23": "16700", "namy21": "15450", "nahy19": "14650"},
    {"name": "المجد", "logo": "magd-logo.png", "bady23": "16750", "namy21": "15480", "nahy19": "14700"},
    {"name": "المصرية الهولندية", "logo": "tarek-logo.png", "bady23": "16850", "namy21": "15550", "nahy19": "14750"},
    {"name": "فيدمكس", "logo": "fedmex-logo.png", "bady23": "16900", "namy21": "15600", "nahy19": "14800"},
    {"name": "السلام", "logo": "salam-logo.png", "bady23": "16780", "namy21": "15520", "nahy19": "14720"},
    {"name": "سامي عياد", "logo": "samy-logo.png", "bady23": "16950", "namy21": "15650", "nahy19": "14850"}
  ],
  "eggs": [
    {"name": "بيض أبيض", "price": "45"},
    {"name": "بيض أحمر", "price": "50"},
    {"name": "بيض بلدي", "price": "60"}
  ],
  "materials": [
    {"name": "ذرة أرجنتيني", "price": "14,800", "icon": "🌽"},
    {"name": "ذرة برازيلي", "price": "14,600", "icon": "🌽"},
    {"name": "ذرة اوكراني", "price": "14,400", "icon": "🌽"},
    {"name": "ذرة امريكي", "price": "15,000", "icon": "🌽"},
    {"name": "صويا 46%", "price": "22,500", "icon": "🌱"},
    {"name": "صويا 44%", "price": "21,800", "icon": "🌱"},
    {"name": "ذرة صفراء", "price": "14,500", "icon": "🌽"},
    {"name": "ذرة بيضاء", "price": "13,800", "icon": "🌽"},
    {"name": "كسب فول الصويا", "price": "22,000", "icon": "🌱"},
    {"name": "نخالة القمح", "price": "8,500", "icon": "🌾"},
    {"name": "مركزات بروتين", "price": "18,000", "icon": "🧪"},
    {"name": "شعير", "price": "9,500", "icon": "🌾"}
  ]
};
}

// Update dashboard statistics
function updateDashboard() {
    const totalProducts = 
        fullData.poultry.length + 
        fullData.chicksCompanies.length + 
        fullData.eggs.length + 
        fullData.feedCompanies.length + 
        fullData.materials.length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalChickCompanies').textContent = fullData.chicksCompanies.length;
    document.getElementById('totalFeedCompanies').textContent = fullData.feedCompanies.length;
    
    const lastUpdateDate = new Date(fullData.lastUpdate);
    const formattedDate = lastUpdateDate.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = formattedDate;
}

// Render all tables
function renderAllTables() {
    renderPoultryTable();
    renderChicksTable();
    renderEggsTable();
    renderFeedTable();
    renderMaterialsTable();
}

// ============ POULTRY TABLE ============
function renderPoultryTable() {
    const tbody = document.getElementById('poultryTableBody');
    tbody.innerHTML = '';
    
    fullData.poultry.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.icon}</td>
                <td>${item.name}</td>
                <td>${item.priceAnnounced} جنيه</td>
                <td>${item.priceExecution} جنيه</td>
                <td>
                    <button class="btn-move" onclick="moveItem('poultry', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-move" onclick="moveItem('poultry', ${index}, 1)" ${index === fullData.poultry.length - 1 ? 'disabled' : ''}>⬇️</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="editPoultry(${index})">تعديل</button>
                    <button class="btn-delete" onclick="deletePoultry(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addPoultry() {
    const name = document.getElementById('poultryName').value.trim();
    const icon = document.getElementById('poultryIcon').value.trim();
    const priceAnnounced = document.getElementById('poultryPriceAnnounced').value.trim();
    const priceExecution = document.getElementById('poultryPriceExecution').value.trim();
    
    if (!name || !icon || !priceAnnounced || !priceExecution) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.poultry.push({ name, icon, priceAnnounced, priceExecution });
    hasUnsavedChanges = true;
    renderPoultryTable();
    clearPoultryInputs();
    showAlert('تمت إضافة المنتج بنجاح', 'success');
}

function editPoultry(index) {
    currentEditIndex = index;
    currentEditCategory = 'poultry';
    const item = fullData.poultry[index];
    
    document.getElementById('poultryName').value = item.name;
    document.getElementById('poultryIcon').value = item.icon;
    document.getElementById('poultryPriceAnnounced').value = item.priceAnnounced;
    document.getElementById('poultryPriceExecution').value = item.priceExecution;
    
    document.getElementById('addPoultryBtn').style.display = 'none';
    document.getElementById('updatePoultryBtn').style.display = 'inline-block';
}

function updatePoultry() {
    const name = document.getElementById('poultryName').value.trim();
    const icon = document.getElementById('poultryIcon').value.trim();
    const priceAnnounced = document.getElementById('poultryPriceAnnounced').value.trim();
    const priceExecution = document.getElementById('poultryPriceExecution').value.trim();
    
    if (!name || !icon || !priceAnnounced || !priceExecution) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.poultry[currentEditIndex] = { name, icon, priceAnnounced, priceExecution };
    hasUnsavedChanges = true;
    renderPoultryTable();
    clearPoultryInputs();
    cancelEdit();
    showAlert('تم تحديث المنتج بنجاح', 'success');
}

function deletePoultry(index) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        fullData.poultry.splice(index, 1);
        hasUnsavedChanges = true;
        renderPoultryTable();
        showAlert('تم حذف المنتج بنجاح', 'success');
    }
}

function clearPoultryInputs() {
    document.getElementById('poultryName').value = '';
    document.getElementById('poultryIcon').value = '';
    document.getElementById('poultryPriceAnnounced').value = '';
    document.getElementById('poultryPriceExecution').value = '';
}

// ============ CHICKS TABLE (WITH LOGOS) ============
function renderChicksTable() {
    const tbody = document.getElementById('chicksTableBody');
    tbody.innerHTML = '';
    
    fullData.chicksCompanies.forEach((item, index) => {
        const logoHTML = item.logo ? 
            `<img src="../${item.logo}" alt="${item.name}" style="width:40px; height:auto; border-radius:4px;">` : 
            '<span style="color:#999;">بدون لوجو</span>';
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${logoHTML}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn-move" onclick="moveItem('chicksCompanies', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-move" onclick="moveItem('chicksCompanies', ${index}, 1)" ${index === fullData.chicksCompanies.length - 1 ? 'disabled' : ''}>⬇️</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="editChicks(${index})">تعديل</button>
                    <button class="btn-delete" onclick="deleteChicks(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addChicks() {
    const name = document.getElementById('chicksName').value.trim();
    const logo = document.getElementById('chicksLogo').value.trim();
    const price = document.getElementById('chicksPrice').value.trim();
    
    if (!name || !price) {
        showAlert('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }
    
    fullData.chicksCompanies.push({ 
        name, 
        logo: logo || null, 
        price 
    });
    hasUnsavedChanges = true;
    renderChicksTable();
    clearChicksInputs();
    showAlert('تمت إضافة الشركة بنجاح', 'success');
}

function editChicks(index) {
    currentEditIndex = index;
    currentEditCategory = 'chicks';
    const item = fullData.chicksCompanies[index];
    
    document.getElementById('chicksName').value = item.name;
    document.getElementById('chicksLogo').value = item.logo || '';
    document.getElementById('chicksPrice').value = item.price;
    
    document.getElementById('addChicksBtn').style.display = 'none';
    document.getElementById('updateChicksBtn').style.display = 'inline-block';
}

function updateChicks() {
    const name = document.getElementById('chicksName').value.trim();
    const logo = document.getElementById('chicksLogo').value.trim();
    const price = document.getElementById('chicksPrice').value.trim();
    
    if (!name || !price) {
        showAlert('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }
    
    fullData.chicksCompanies[currentEditIndex] = { 
        name, 
        logo: logo || null, 
        price 
    };
    hasUnsavedChanges = true;
    renderChicksTable();
    clearChicksInputs();
    cancelEdit();
    showAlert('تم تحديث الشركة بنجاح', 'success');
}

function deleteChicks(index) {
    if (confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
        fullData.chicksCompanies.splice(index, 1);
        hasUnsavedChanges = true;
        renderChicksTable();
        showAlert('تم حذف الشركة بنجاح', 'success');
    }
}

function clearChicksInputs() {
    document.getElementById('chicksName').value = '';
    document.getElementById('chicksLogo').value = '';
    document.getElementById('chicksPrice').value = '';
}

// ============ FEED TABLE (WITH 3 PRICES) ============
function renderFeedTable() {
    const tbody = document.getElementById('feedTableBody');
    tbody.innerHTML = '';
    
    fullData.feedCompanies.forEach((item, index) => {
        const logoHTML = item.logo ? 
            `<img src="../${item.logo}" alt="${item.name}" style="width:40px; height:auto; border-radius:4px;">` : 
            '<span style="color:#999;">بدون لوجو</span>';
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${logoHTML}</td>
                <td>${item.name}</td>
                <td>${item.bady23} جنيه</td>
                <td>${item.namy21} جنيه</td>
                <td>${item.nahy19} جنيه</td>
                <td>
                    <button class="btn-move" onclick="moveItem('feedCompanies', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-move" onclick="moveItem('feedCompanies', ${index}, 1)" ${index === fullData.feedCompanies.length - 1 ? 'disabled' : ''}>⬇️</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="editFeed(${index})">تعديل</button>
                    <button class="btn-delete" onclick="deleteFeed(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addFeed() {
    const name = document.getElementById('feedName').value.trim();
    const logo = document.getElementById('feedLogo').value.trim();
    const bady23 = document.getElementById('feedBady23').value.trim();
    const namy21 = document.getElementById('feedNamy21').value.trim();
    const nahy19 = document.getElementById('feedNahy19').value.trim();
    
    if (!name || !bady23 || !namy21 || !nahy19) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    fullData.feedCompanies.push({ 
        name, 
        logo: logo || null, 
        bady23, 
        namy21, 
        nahy19 
    });
    hasUnsavedChanges = true;
    renderFeedTable();
    clearFeedInputs();
    showAlert('تمت إضافة الشركة بنجاح', 'success');
}

function editFeed(index) {
    currentEditIndex = index;
    currentEditCategory = 'feed';
    const item = fullData.feedCompanies[index];
    
    document.getElementById('feedName').value = item.name;
    document.getElementById('feedLogo').value = item.logo || '';
    document.getElementById('feedBady23').value = item.bady23;
    document.getElementById('feedNamy21').value = item.namy21;
    document.getElementById('feedNahy19').value = item.nahy19;
    
    document.getElementById('addFeedBtn').style.display = 'none';
    document.getElementById('updateFeedBtn').style.display = 'inline-block';
}

function updateFeed() {
    const name = document.getElementById('feedName').value.trim();
    const logo = document.getElementById('feedLogo').value.trim();
    const bady23 = document.getElementById('feedBady23').value.trim();
    const namy21 = document.getElementById('feedNamy21').value.trim();
    const nahy19 = document.getElementById('feedNahy19').value.trim();
    
    if (!name || !bady23 || !namy21 || !nahy19) {
        showAlert('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    fullData.feedCompanies[currentEditIndex] = { 
        name, 
        logo: logo || null, 
        bady23, 
        namy21, 
        nahy19 
    };
    hasUnsavedChanges = true;
    renderFeedTable();
    clearFeedInputs();
    cancelEdit();
    showAlert('تم تحديث الشركة بنجاح', 'success');
}

function deleteFeed(index) {
    if (confirm('هل أنت متأكد من حذف هذه الشركة؟')) {
        fullData.feedCompanies.splice(index, 1);
        hasUnsavedChanges = true;
        renderFeedTable();
        showAlert('تم حذف الشركة بنجاح', 'success');
    }
}

function clearFeedInputs() {
    document.getElementById('feedName').value = '';
    document.getElementById('feedLogo').value = '';
    document.getElementById('feedBady23').value = '';
    document.getElementById('feedNamy21').value = '';
    document.getElementById('feedNahy19').value = '';
}

// ============ EGGS TABLE ============
function renderEggsTable() {
    const tbody = document.getElementById('eggsTableBody');
    tbody.innerHTML = '';
    
    fullData.eggs.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn-move" onclick="moveItem('eggs', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-move" onclick="moveItem('eggs', ${index}, 1)" ${index === fullData.eggs.length - 1 ? 'disabled' : ''}>⬇️</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="editEggs(${index})">تعديل</button>
                    <button class="btn-delete" onclick="deleteEggs(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addEggs() {
    const name = document.getElementById('eggsName').value.trim();
    const price = document.getElementById('eggsPrice').value.trim();
    
    if (!name || !price) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.eggs.push({ name, price });
    hasUnsavedChanges = true;
    renderEggsTable();
    clearEggsInputs();
    showAlert('تمت إضافة المنتج بنجاح', 'success');
}

function editEggs(index) {
    currentEditIndex = index;
    currentEditCategory = 'eggs';
    const item = fullData.eggs[index];
    
    document.getElementById('eggsName').value = item.name;
    document.getElementById('eggsPrice').value = item.price;
    
    document.getElementById('addEggsBtn').style.display = 'none';
    document.getElementById('updateEggsBtn').style.display = 'inline-block';
}

function updateEggs() {
    const name = document.getElementById('eggsName').value.trim();
    const price = document.getElementById('eggsPrice').value.trim();
    
    if (!name || !price) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.eggs[currentEditIndex] = { name, price };
    hasUnsavedChanges = true;
    renderEggsTable();
    clearEggsInputs();
    cancelEdit();
    showAlert('تم تحديث المنتج بنجاح', 'success');
}

function deleteEggs(index) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        fullData.eggs.splice(index, 1);
        hasUnsavedChanges = true;
        renderEggsTable();
        showAlert('تم حذف المنتج بنجاح', 'success');
    }
}

function clearEggsInputs() {
    document.getElementById('eggsName').value = '';
    document.getElementById('eggsPrice').value = '';
}

// ============ MATERIALS TABLE ============
function renderMaterialsTable() {
    const tbody = document.getElementById('materialsTableBody');
    tbody.innerHTML = '';
    
    fullData.materials.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.icon}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn-move" onclick="moveItem('materials', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                    <button class="btn-move" onclick="moveItem('materials', ${index}, 1)" ${index === fullData.materials.length - 1 ? 'disabled' : ''}>⬇️</button>
                </td>
                <td>
                    <button class="btn-edit" onclick="editMaterials(${index})">تعديل</button>
                    <button class="btn-delete" onclick="deleteMaterials(${index})">حذف</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function addMaterials() {
    const name = document.getElementById('materialsName').value.trim();
    const icon = document.getElementById('materialsIcon').value.trim();
    const price = document.getElementById('materialsPrice').value.trim();
    
    if (!name || !icon || !price) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.materials.push({ name, icon, price });
    hasUnsavedChanges = true;
    renderMaterialsTable();
    clearMaterialsInputs();
    showAlert('تمت إضافة المادة بنجاح', 'success');
}

function editMaterials(index) {
    currentEditIndex = index;
    currentEditCategory = 'materials';
    const item = fullData.materials[index];
    
    document.getElementById('materialsName').value = item.name;
    document.getElementById('materialsIcon').value = item.icon;
    document.getElementById('materialsPrice').value = item.price;
    
    document.getElementById('addMaterialsBtn').style.display = 'none';
    document.getElementById('updateMaterialsBtn').style.display = 'inline-block';
}

function updateMaterials() {
    const name = document.getElementById('materialsName').value.trim();
    const icon = document.getElementById('materialsIcon').value.trim();
    const price = document.getElementById('materialsPrice').value.trim();
    
    if (!name || !icon || !price) {
        showAlert('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    fullData.materials[currentEditIndex] = { name, icon, price };
    hasUnsavedChanges = true;
    renderMaterialsTable();
    clearMaterialsInputs();
    cancelEdit();
    showAlert('تم تحديث المادة بنجاح', 'success');
}

function deleteMaterials(index) {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
        fullData.materials.splice(index, 1);
        hasUnsavedChanges = true;
        renderMaterialsTable();
        showAlert('تم حذف المادة بنجاح', 'success');
    }
}

function clearMaterialsInputs() {
    document.getElementById('materialsName').value = '';
    document.getElementById('materialsIcon').value = '';
    document.getElementById('materialsPrice').value = '';
}

// ============ UTILITY FUNCTIONS ============

// Move item up or down
function moveItem(category, index, direction) {
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= fullData[category].length) {
        return;
    }
    
    // Swap items
    const temp = fullData[category][index];
    fullData[category][index] = fullData[category][newIndex];
    fullData[category][newIndex] = temp;
    
    hasUnsavedChanges = true;
    
    // Re-render the appropriate table
    switch(category) {
        case 'poultry':
            renderPoultryTable();
            break;
        case 'chicksCompanies':
            renderChicksTable();
            break;
        case 'feedCompanies':
            renderFeedTable();
            break;
        case 'eggs':
            renderEggsTable();
            break;
        case 'materials':
            renderMaterialsTable();
            break;
    }
    
    showAlert('✅ تم تغيير الترتيب', 'success');
}

function cancelEdit() {
    currentEditIndex = null;
    currentEditCategory = null;
    
    document.querySelectorAll('[id^="add"]').forEach(btn => btn.style.display = 'inline-block');
    document.querySelectorAll('[id^="update"]').forEach(btn => btn.style.display = 'none');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Save all changes
async function saveAllChanges() {
    try {
        fullData.lastUpdate = new Date().toISOString();
        
        // Save to Cloudflare KV via API
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fullData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                hasUnsavedChanges = false;
                updateDashboard();
                
                // Success message
                showAlert('✅ تم حفظ البيانات بنجاح! الموقع محدث الآن', 'success');
                
                // Download uploaded images if any
                if (window.uploadedFiles && Object.keys(window.uploadedFiles).length > 0) {
                    setTimeout(() => {
                        downloadUploadedFiles();
                        showAlert('📥 يرجى رفع الصور المحملة إلى مجلد الموقع', 'info');
                    }, 1000);
                }
                return;
            } else {
                throw new Error(result.message || 'فشل الحفظ');
            }
        } catch (serverError) {
            console.error('Cloudflare KV save failed:', serverError);
            showAlert('❌ فشل حفظ البيانات على Cloudflare: ' + serverError.message, 'error');
        }
        
        // Fallback: Download JSON file
        const dataStr = JSON.stringify(fullData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'full-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Download uploaded images
        if (window.uploadedFiles && Object.keys(window.uploadedFiles).length > 0) {
            setTimeout(() => downloadUploadedFiles(), 500);
        }
        
        hasUnsavedChanges = false;
        showAlert('⬇️ تم حفظ البيانات محلياً. يرجى رفعها للسيرفر يدوياً', 'success');
    } catch (error) {
        showAlert('❌ فشل حفظ البيانات: ' + error.message, 'error');
    }
}

// Tab Navigation
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Handle Logo Upload
function handleLogoUpload(input, targetInputId) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileName = file.name;
        
        // Set the filename in the text input
        document.getElementById(targetInputId).value = fileName;
        
        // Create a data URL for preview
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store the file data for later upload
            if (!window.uploadedFiles) window.uploadedFiles = {};
            window.uploadedFiles[fileName] = {
                data: e.target.result,
                file: file
            };
            
            showAlert(`✅ تم تحديد الملف: ${fileName}. سيتم رفعه عند الحفظ`, 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Handle Icon Upload
function handleIconUpload(input, targetInputId) {
    handleLogoUpload(input, targetInputId);
}

// Download uploaded files as ZIP (helper function)
function downloadUploadedFiles() {
    if (!window.uploadedFiles || Object.keys(window.uploadedFiles).length === 0) {
        showAlert('⚠️ لا توجد ملفات لرفعها', 'error');
        return;
    }
    
    showAlert(`📦 يوجد ${Object.keys(window.uploadedFiles).length} ملف للرفع. سيتم تنزيلها معاً`, 'success');
    
    // Download each file
    for (const [fileName, fileData] of Object.entries(window.uploadedFiles)) {
        const a = document.createElement('a');
        a.href = fileData.data;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
