/**
 * Unified Navigation Highlighting
 * Manages active states across all menu items and tabs uniformly
 */

(function() {
    function initNavHighlighting() {
        // Get current page filename
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Map pages to their active tab/menu item
        var pageMap = {
            'index.html': { type: 'menu', selector: 'a[href="index.html"]' },
            'labtech-dashboard.html': { type: 'menu', selector: 'a[href="labtech-dashboard.html"]' },
            'inventory.html': { type: 'tab', tab: 'inventory' },
            'equipment.html': { type: 'tab', tab: 'equipment' },
            'admin-requests.html': { type: 'menu', selector: 'a[href="admin-requests.html"]' },
            'activity-log.html': { type: 'menu', selector: 'a[href="activity-log.html"]' },
            'admin-settings.html': { type: 'menu', selector: 'a[href="admin-settings.html"]' },
            'add-schedule.html': { type: 'tab', tab: 'schedule' },
            'lecture-rooms.html': { type: 'tab', tab: 'lecture' },
            'laboratory-rooms.html': { type: 'tab', tab: 'lab' },
            'room-logs.html': { type: 'tab', tab: 'logs' }
        };

        var config = pageMap[currentPage];
        if (!config) return;

        // Clear all active states first
        document.querySelectorAll('.menu-item.active').forEach(function(el) {
            el.classList.remove('active');
        });
        document.querySelectorAll('.menu-tab.active').forEach(function(el) {
            el.classList.remove('active');
        });

        // Set active state based on page
        if (config.type === 'menu') {
            var menuItem = document.querySelector(config.selector);
            if (menuItem) {
                menuItem.classList.add('active');
            }
        } else if (config.type === 'tab') {
            var tab = document.querySelector('[data-tab="' + config.tab + '"]');
            if (tab) {
                tab.classList.add('active');
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavHighlighting);
    } else {
        initNavHighlighting();
    }
})();
