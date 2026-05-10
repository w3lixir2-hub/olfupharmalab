/**
 * Unified Navigation Highlighting
 * Single source of truth for which sidebar item is "active" on each page.
 * Sidebar HTML is identical on every page; this script just applies .active.
 */
(function () {
    function initNavHighlighting() {
        var currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (!currentPage || currentPage.indexOf('.html') === -1) currentPage = 'index.html';

        // Page → which sidebar element gets .active
        // type 'menu' = top-level <a class="menu-item">, matched by data-page
        // type 'tab'  = nested <a class="menu-tab"> inside a .menu-section
        var pageMap = {
            'index.html':              { type: 'menu', key: 'index' },
            'labtech-dashboard.html':  { type: 'tab',  key: 'labtech' },
            'admin-requests.html':     { type: 'tab',  key: 'requests' },
            'inventory.html':          { type: 'tab',  key: 'inventory' },
            'equipment.html':          { type: 'tab',  key: 'equipment' },
            'add-schedule.html':       { type: 'tab',  key: 'schedule' },
            'lecture-rooms.html':      { type: 'tab',  key: 'lecture' },
            'laboratory-rooms.html':   { type: 'tab',  key: 'lab' },
            'room-logs.html':          { type: 'tab',  key: 'logs' },
            'activity-log.html':       { type: 'menu', key: 'activity-log' },
            'admin-settings.html':     { type: 'menu', key: 'admin-settings' }
        };

        var config = pageMap[currentPage];
        if (!config) return;

        // Clear any stale active states
        document.querySelectorAll('.sidebar .menu-item.active, .sidebar .menu-tab.active')
            .forEach(function (el) { el.classList.remove('active'); });

        var target = null;
        if (config.type === 'menu') {
            target = document.querySelector('.sidebar .menu-item[data-page="' + config.key + '"]');
        } else {
            target = document.querySelector('.sidebar .menu-tab[data-tab="' + config.key + '"]');
        }
        if (target) target.classList.add('active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavHighlighting);
    } else {
        initNavHighlighting();
    }
})();
