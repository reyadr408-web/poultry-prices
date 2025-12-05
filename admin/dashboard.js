// Dashboard Management System for Poultry Market Website
let pricesData = null;
let currentEditIndex = null;
let currentEditCategory = null;
let hasUnsavedChanges = false;

// Check if user is logged in
if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPricesData();
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

// Load prices data from JSON file
async function loadPricesData() {
    try {
        const response = await fetch('../prices-data.json');
        pricesData = await response.json();
        updateDashboard();
        renderAllTables();
    } catch (error) {
        showAlert('فشل تحميل البيانات: ' + error.message, 'error');
    }
}

// Update dashboard statistics
function updateDashboard() {
    const totalProducts = 
        pricesData.poultry.length + 
        pricesData.chicks.length + 
        pricesData.eggs.length + 
        pricesData.feed.length + 
        pricesData.materials.length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalChickCompanies').textContent = pricesData.chicks.length;
    document.getElementById('totalFeedCompanies').textContent = pricesData.feed.length;
    
    const lastUpdate = new Date(pricesData.lastUpdate);
    document.getElementById('lastUpdate').textContent = lastUpdate.toLocaleDateString('ar-EG');
}

// Render all tables
function renderAllTables() {
    renderPoultryTable();
    renderChicksTable();
    renderEggsTable();
    renderFeedTable();
    renderMaterialsTable();
}

// Render Poultry Table
function renderPoultryTable() {
    const tbody = document.querySelector('#poultry-table tbody');
    tbody.innerHTML = '';
    
    pricesData.poultry.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><span class="icon-preview">${item.icon}</span></td>
                <td>${item.name}</td>
                <td>${item.priceAnnounced} جنيه</td>
                <td>${item.priceExecution} جنيه</td>
                <td>
                    <button class="btn btn-edit" onclick="editItem('poultry', ${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteItem('poultry', ${index})">حذف</button>
                    ${index > 0 ? `<button class="btn btn-up" onclick="moveItem('poultry', ${index}, -1)">↑</button>` : ''}
                    ${index < pricesData.poultry.length - 1 ? `<button class="btn btn-down" onclick="moveItem('poultry', ${index}, 1)">↓</button>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Render Chicks Table
function renderChicksTable() {
    const tbody = document.querySelector('#chicks-table tbody');
    tbody.innerHTML = '';
    
    pricesData.chicks.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn btn-edit" onclick="editItem('chicks', ${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteItem('chicks', ${index})">حذف</button>
                    ${index > 0 ? `<button class="btn btn-up" onclick="moveItem('chicks', ${index}, -1)">↑</button>` : ''}
                    ${index < pricesData.chicks.length - 1 ? `<button class="btn btn-down" onclick="moveItem('chicks', ${index}, 1)">↓</button>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Render Eggs Table
function renderEggsTable() {
    const tbody = document.querySelector('#eggs-table tbody');
    tbody.innerHTML = '';
    
    pricesData.eggs.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn btn-edit" onclick="editItem('eggs', ${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteItem('eggs', ${index})">حذف</button>
                    ${index > 0 ? `<button class="btn btn-up" onclick="moveItem('eggs', ${index}, -1)">↑</button>` : ''}
                    ${index < pricesData.eggs.length - 1 ? `<button class="btn btn-down" onclick="moveItem('eggs', ${index}, 1)">↓</button>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Render Feed Table
function renderFeedTable() {
    const tbody = document.querySelector('#feed-table tbody');
    tbody.innerHTML = '';
    
    pricesData.feed.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn btn-edit" onclick="editItem('feed', ${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteItem('feed', ${index})">حذف</button>
                    ${index > 0 ? `<button class="btn btn-up" onclick="moveItem('feed', ${index}, -1)">↑</button>` : ''}
                    ${index < pricesData.feed.length - 1 ? `<button class="btn btn-down" onclick="moveItem('feed', ${index}, 1)">↓</button>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Render Materials Table
function renderMaterialsTable() {
    const tbody = document.querySelector('#materials-table tbody');
    tbody.innerHTML = '';
    
    pricesData.materials.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><span class="icon-preview">${item.icon}</span></td>
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>
                    <button class="btn btn-edit" onclick="editItem('materials', ${index})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteItem('materials', ${index})">حذف</button>
                    ${index > 0 ? `<button class="btn btn-up" onclick="moveItem('materials', ${index}, -1)">↑</button>` : ''}
                    ${index < pricesData.materials.length - 1 ? `<button class="btn btn-down" onclick="moveItem('materials', ${index}, 1)">↓</button>` : ''}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Switch tabs
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Open add modal
function openAddModal(category) {
    currentEditCategory = category;
    currentEditIndex = null;
    
    let formHTML = '';
    
    switch(category) {
        case 'poultry':
            formHTML = `
                <div class="form-group">
                    <label>النوع</label>
                    <input type="text" id="edit-name" placeholder="مثال: فراخ بيضاء">
                </div>
                <div class="form-group">
                    <label>الأيقونة</label>
                    <select id="edit-icon">
                        <option value="🐔">🐔 دجاج</option>
                        <option value="🦃">🦃 رومي</option>
                        <option value="🦆">🦆 بط</option>
                        <option value="🐦">🐦 سمان</option>
                    </select>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>السعر المعلن</label>
                        <input type="number" id="edit-priceAnnounced" placeholder="60">
                    </div>
                    <div class="form-group">
                        <label>سعر التنفيذ</label>
                        <input type="number" id="edit-priceExecution" placeholder="58">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">إضافة</button>
            `;
            break;
            
        case 'chicks':
            formHTML = `
                <div class="form-group">
                    <label>اسم الشركة</label>
                    <input type="text" id="edit-name" placeholder="مثال: الوادي">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="number" step="0.1" id="edit-price" placeholder="12.5">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="teal">Teal</option>
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="orange">Orange</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">إضافة</button>
            `;
            break;
            
        case 'eggs':
            formHTML = `
                <div class="form-group">
                    <label>نوع البيض</label>
                    <input type="text" id="edit-name" placeholder="مثال: بيض أبيض">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="number" id="edit-price" placeholder="45">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="blue">Blue</option>
                        <option value="brown">Brown</option>
                        <option value="teal">Teal</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">إضافة</button>
            `;
            break;
            
        case 'feed':
            formHTML = `
                <div class="form-group">
                    <label>اسم العلف</label>
                    <input type="text" id="edit-name" placeholder="مثال: علف تسمين">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="number" id="edit-price" placeholder="14500">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="green">Green</option>
                        <option value="orange">Orange</option>
                        <option value="teal">Teal</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">إضافة</button>
            `;
            break;
            
        case 'materials':
            formHTML = `
                <div class="form-group">
                    <label>اسم الخامة</label>
                    <input type="text" id="edit-name" placeholder="مثال: ذرة صفراء">
                </div>
                <div class="form-group">
                    <label>الأيقونة</label>
                    <select id="edit-icon">
                        <option value="🌽">🌽 ذرة</option>
                        <option value="🌱">🌱 صويا</option>
                        <option value="🌾">🌾 قمح/شعير</option>
                        <option value="🧪">🧪 مركزات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="text" id="edit-price" placeholder="14,500">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="orange">Orange</option>
                        <option value="green">Green</option>
                        <option value="teal">Teal</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">إضافة</button>
            `;
            break;
    }
    
    document.getElementById('modalForm').innerHTML = formHTML;
    document.getElementById('editModal').classList.add('active');
}

// Edit item
function editItem(category, index) {
    currentEditCategory = category;
    currentEditIndex = index;
    
    const item = pricesData[category][index];
    let formHTML = '';
    
    switch(category) {
        case 'poultry':
            formHTML = `
                <div class="form-group">
                    <label>النوع</label>
                    <input type="text" id="edit-name" value="${item.name}">
                </div>
                <div class="form-group">
                    <label>الأيقونة</label>
                    <select id="edit-icon">
                        <option value="🐔" ${item.icon === '🐔' ? 'selected' : ''}>🐔 دجاج</option>
                        <option value="🦃" ${item.icon === '🦃' ? 'selected' : ''}>🦃 رومي</option>
                        <option value="🦆" ${item.icon === '🦆' ? 'selected' : ''}>🦆 بط</option>
                        <option value="🐦" ${item.icon === '🐦' ? 'selected' : ''}>🐦 سمان</option>
                    </select>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>السعر المعلن</label>
                        <input type="number" id="edit-priceAnnounced" value="${item.priceAnnounced}">
                    </div>
                    <div class="form-group">
                        <label>سعر التنفيذ</label>
                        <input type="number" id="edit-priceExecution" value="${item.priceExecution}">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">حفظ التعديلات</button>
            `;
            break;
            
        case 'chicks':
        case 'eggs':
        case 'feed':
            formHTML = `
                <div class="form-group">
                    <label>الاسم</label>
                    <input type="text" id="edit-name" value="${item.name}">
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="${category === 'chicks' ? 'number' : 'number'}" ${category === 'chicks' ? 'step="0.1"' : ''} id="edit-price" value="${item.price}">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="teal" ${item.badge === 'teal' ? 'selected' : ''}>Teal</option>
                        <option value="blue" ${item.badge === 'blue' ? 'selected' : ''}>Blue</option>
                        <option value="green" ${item.badge === 'green' ? 'selected' : ''}>Green</option>
                        <option value="orange" ${item.badge === 'orange' ? 'selected' : ''}>Orange</option>
                        <option value="brown" ${item.badge === 'brown' ? 'selected' : ''}>Brown</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">حفظ التعديلات</button>
            `;
            break;
            
        case 'materials':
            formHTML = `
                <div class="form-group">
                    <label>اسم الخامة</label>
                    <input type="text" id="edit-name" value="${item.name}">
                </div>
                <div class="form-group">
                    <label>الأيقونة</label>
                    <select id="edit-icon">
                        <option value="🌽" ${item.icon === '🌽' ? 'selected' : ''}>🌽 ذرة</option>
                        <option value="🌱" ${item.icon === '🌱' ? 'selected' : ''}>🌱 صويا</option>
                        <option value="🌾" ${item.icon === '🌾' ? 'selected' : ''}>🌾 قمح/شعير</option>
                        <option value="🧪" ${item.icon === '🧪' ? 'selected' : ''}>🧪 مركزات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>السعر</label>
                    <input type="text" id="edit-price" value="${item.price}">
                </div>
                <div class="form-group">
                    <label>اللون</label>
                    <select id="edit-badge">
                        <option value="orange" ${item.badge === 'orange' ? 'selected' : ''}>Orange</option>
                        <option value="green" ${item.badge === 'green' ? 'selected' : ''}>Green</option>
                        <option value="teal" ${item.badge === 'teal' ? 'selected' : ''}>Teal</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="saveItem()">حفظ التعديلات</button>
            `;
            break;
    }
    
    document.getElementById('modalForm').innerHTML = formHTML;
    document.getElementById('editModal').classList.add('active');
}

// Save item
function saveItem() {
    const name = document.getElementById('edit-name').value;
    
    if (!name) {
        showAlert('الرجاء إدخال الاسم', 'error');
        return;
    }
    
    let item = {};
    
    switch(currentEditCategory) {
        case 'poultry':
            item = {
                name: name,
                icon: document.getElementById('edit-icon').value,
                priceAnnounced: document.getElementById('edit-priceAnnounced').value,
                priceExecution: document.getElementById('edit-priceExecution').value
            };
            break;
            
        case 'chicks':
        case 'eggs':
        case 'feed':
            item = {
                name: name,
                price: document.getElementById('edit-price').value,
                badge: document.getElementById('edit-badge').value
            };
            break;
            
        case 'materials':
            item = {
                name: name,
                icon: document.getElementById('edit-icon').value,
                price: document.getElementById('edit-price').value,
                badge: document.getElementById('edit-badge').value
            };
            break;
    }
    
    if (currentEditIndex !== null) {
        // Update existing item
        pricesData[currentEditCategory][currentEditIndex] = item;
        showAlert('تم التعديل بنجاح', 'success');
    } else {
        // Add new item
        pricesData[currentEditCategory].push(item);
        showAlert('تم الإضافة بنجاح', 'success');
    }
    
    hasUnsavedChanges = true;
    closeModal();
    renderAllTables();
    updateDashboard();
}

// Delete item
function deleteItem(category, index) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        pricesData[category].splice(index, 1);
        hasUnsavedChanges = true;
        renderAllTables();
        updateDashboard();
        showAlert('تم الحذف بنجاح', 'success');
    }
}

// Move item up or down
function moveItem(category, index, direction) {
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= pricesData[category].length) {
        return;
    }
    
    // Swap items
    const temp = pricesData[category][index];
    pricesData[category][index] = pricesData[category][newIndex];
    pricesData[category][newIndex] = temp;
    
    hasUnsavedChanges = true;
    renderAllTables();
    showAlert('تم تغيير الترتيب', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Show alert
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Save all changes
async function saveAllChanges() {
    if (!hasUnsavedChanges) {
        showAlert('لا توجد تغييرات للحفظ', 'error');
        return;
    }
    
    // Update last update time
    pricesData.lastUpdate = new Date().toISOString();
    
    // Convert to JSON
    const jsonData = JSON.stringify(pricesData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prices-data.json';
    a.click();
    
    showAlert('تم تنزيل الملف! الرجاء رفعه لاستبدال prices-data.json في الموقع', 'success');
    hasUnsavedChanges = false;
    updateDashboard();
}

// Warn before leaving if there are unsaved changes
window.addEventListener('beforeunload', function (e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});
