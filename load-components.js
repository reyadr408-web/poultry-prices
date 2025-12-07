// Load shared components into pages
(function() {
    // Determine base path for components
    const isDetailPage = window.location.pathname.includes('-details/');
    const basePath = isDetailPage ? '../components/' : 'components/';
    const logoPath = isDetailPage ? '../logo.png' : 'logo.png';
    
    // Load component function
    async function loadComponent(elementId, filename) {
        try {
            const response = await fetch(basePath + filename);
            if (response.ok) {
                let html = await response.text();
                
                // Fix logo path for detail pages
                if (isDetailPage && html.includes('logo.png')) {
                    html = html.replace(/src="logo\.png"/g, `src="${logoPath}"`);
                }
                
                // Fix navigation links for detail pages
                if (isDetailPage && html.includes('href="')) {
                    html = html.replace(/href="(?!http|#|\.\.\/)/g, 'href="../');
                }
                
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = html;
                    
                    // After loading header, update the date
                    if (filename === 'header.html') {
                        setTimeout(updateCurrentDate, 50);
                    }
                }
            }
        } catch (error) {
            console.log('Component not loaded:', filename);
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
    
    function initComponents() {
        // Load header and footer
        loadComponent('header-placeholder', 'header.html');
        loadComponent('footer-placeholder', 'footer.html');
    }
    
    function updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement && dateElement.textContent === '') {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('ar-EG', options);
        }
    }
})();
