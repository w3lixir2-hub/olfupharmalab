/**
 * Unify sidebar across all pages.
 * Replaces the entire <aside class="sidebar">...</aside> block
 * with a single canonical version so navigation is identical everywhere.
 *
 * Run: node unify-sidebar.js
 */

const fs = require('fs');
const path = require('path');

const SIDEBAR = `    <aside class="sidebar">
        <nav class="sidebar-menu">
            <!-- 1. Dashboard -->
            <a href="index.html" class="menu-item" data-page="index">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Dashboard
            </a>

            <!-- 2. Lab Tech section (Lab Tech + Requests) -->
            <div class="menu-section">
                <div class="menu-section-title">Lab Tech</div>
                <div class="menu-tabs">
                    <a href="labtech-dashboard.html" class="menu-tab" data-tab="labtech">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Lab Tech
                    </a>
                    <a href="admin-requests.html" class="menu-tab" data-tab="requests">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Requests & Acquisitions
                    </a>
                </div>
            </div>

            <!-- 3. Inventory section (Inventory + Equipment) -->
            <div class="menu-section">
                <div class="menu-section-title">Inventory</div>
                <div class="menu-tabs">
                    <a href="inventory.html" class="menu-tab" data-tab="inventory">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        Inventory
                    </a>
                    <a href="equipment.html" class="menu-tab" data-tab="equipment">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                        Equipment & Glassware
                    </a>
                </div>
            </div>

            <!-- 4. Rooms section (Schedule + Lecture + Lab + Logs) -->
            <div class="menu-section">
                <div class="menu-section-title">Rooms</div>
                <div class="menu-tabs">
                    <a href="add-schedule.html" class="menu-tab" data-tab="schedule">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Add Schedule
                    </a>
                    <a href="lecture-rooms.html" class="menu-tab" data-tab="lecture">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6h20v12H2z"></path><path d="M6 10h2v4H6z"></path><path d="M10 10h2v4h-2z"></path></svg>
                        Lecture Rooms
                    </a>
                    <a href="laboratory-rooms.html" class="menu-tab" data-tab="lab">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                        Laboratory Rooms
                    </a>
                    <a href="room-logs.html" class="menu-tab" data-tab="logs">
                        <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Room Usage Logs
                    </a>
                </div>
            </div>

            <!-- 5. Activity Log -->
            <a href="activity-log.html" class="menu-item" data-page="activity-log">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Activity Log
            </a>

            <!-- 6. Settings (pinned to bottom) -->
            <a href="admin-settings.html" class="menu-item menu-settings" data-page="admin-settings">
                <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
            </a>
        </nav>
        <div class="sidebar-footer">
            <div id="sidebar-datetime">—</div>
            <div style="margin-top:4px;font-size:11px;">Philippine Time (PHT)</div>
        </div>
    </aside>`;

const FILES = [
    'index.html',
    'labtech-dashboard.html',
    'inventory.html',
    'equipment.html',
    'admin-requests.html',
    'activity-log.html',
    'admin-settings.html',
    'add-schedule.html',
    'lecture-rooms.html',
    'laboratory-rooms.html',
    'room-logs.html'
];

// Matches <aside class="sidebar"> ... </aside> (greedy but stops at first </aside>)
const SIDEBAR_REGEX = /[ \t]*<aside class="sidebar">[\s\S]*?<\/aside>/m;

let updated = 0, skipped = 0;

FILES.forEach(function(file) {
    var filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log('SKIP (missing): ' + file);
        skipped++;
        return;
    }

    var content = fs.readFileSync(filePath, 'utf8');
    if (!SIDEBAR_REGEX.test(content)) {
        console.log('SKIP (no sidebar match): ' + file);
        skipped++;
        return;
    }

    var next = content.replace(SIDEBAR_REGEX, SIDEBAR);

    // Strip page-local .menu-tab / .menu-settings inline styles since they're now in lab-ui.css
    next = next.replace(/\n?\s*\/\* Sidebar tabbed sections \*\/[\s\S]*?\.menu-settings\s*\{[^}]*\}\s*/g, '\n');

    // Ensure nav-highlighting.js is referenced
    if (!/js\/nav-highlighting\.js/.test(next)) {
        next = next.replace(
            /(<script src="js\/auth-guard\.js"><\/script>)/,
            '$1\n    <script src="js/nav-highlighting.js"></script>'
        );
        // Fallback: if no auth-guard, insert before first inline <script> after supabase-data
        if (!/js\/nav-highlighting\.js/.test(next)) {
            next = next.replace(
                /(<script src="js\/supabase-data\.js"><\/script>)/,
                '$1\n    <script src="js/nav-highlighting.js"></script>'
            );
        }
    }

    fs.writeFileSync(filePath, next, 'utf8');
    console.log('OK: ' + file);
    updated++;
});

console.log('\nDone. Updated: ' + updated + ', Skipped: ' + skipped);
