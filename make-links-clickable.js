// Convert onclick elements to proper links for right-click support
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertOnclickToLinks);
    } else {
        convertOnclickToLinks();
    }
    
    function convertOnclickToLinks() {
        // Find all elements with onclick that navigate
        const clickableElements = document.querySelectorAll('[onclick*="window.location.href"]');
        
        clickableElements.forEach(element => {
            const onclickAttr = element.getAttribute('onclick');
            
            // Extract the URL from onclick="window.location.href='...'"
            const urlMatch = onclickAttr.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
            
            if (urlMatch && urlMatch[1]) {
                const url = urlMatch[1];
                
                // Store the URL as data attribute
                element.setAttribute('data-href', url);
                
                // Create invisible link overlay
                const link = document.createElement('a');
                link.href = url;
                link.className = element.tagName.toLowerCase() === 'tr' ? 'row-link' : 'card-link';
                link.setAttribute('aria-label', 'انتقل إلى ' + url);
                
                // Insert link as first child
                element.insertBefore(link, element.firstChild);
                
                // Keep onclick for backward compatibility but also handle link clicks
                element.addEventListener('click', function(e) {
                    // If clicking on the overlay link, let it work naturally
                    if (e.target.tagName === 'A') {
                        return;
                    }
                    // Otherwise use onclick behavior
                    window.location.href = url;
                });
            }
        });
    }
})();
