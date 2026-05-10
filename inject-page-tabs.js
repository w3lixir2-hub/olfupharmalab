/**
 * Inject in-page top tabs into paired pages.
 * Active state is applied at runtime by nav-highlighting.js based on URL.
 *
 * Pairs:
 *   Lab Tech     : labtech-dashboard.html  + admin-requests.html
 *   Inventory    : inventory.html          + equipment.html
 *   Rooms        : lecture-rooms.html      + laboratory-rooms.html
 *   Activity Log : activity-log.html       + room-logs.html
 *
 * Run: node inject-page-tabs.js
 */

const fs = require('fs');
const path = require('path');

// Each tab group renders the same markup on both paired pages; JS sets .active.
const TAB_GROUPS = {
    labtech: [
        { href: 'labtech-dashboard.html', label: 'Lab Tech' },
        { href: 'admin-requests.html',    label: 'Requests & Acquisitions' }
    ],
    inventory: [
        { href: 'inventory.html', label: 'Lab Tech Inventory' },
        { href: 'equipment.html', label: 'Glasswares' }
    ],
    rooms: [
        { href: 'lecture-rooms.html',    label: 'Lecture Rooms' },
        { href: 'laboratory-rooms.html', label: 'Laboratory Rooms' }
    ],
    activity: [
        { href: 'activity-log.html', label: 'Staff Log' },
        { href: 'room-logs.html',    label: 'Room Logs' }
    ]
};

// Map each page → which tab group to inject
const PAGE_GROUP = {
    'labtech-dashboard.html': 'labtech',
    'admin-requests.html':    'labtech',
    'inventory.html':         'inventory',
    'equipment.html':         'inventory',
    'lecture-rooms.html':     'rooms',
    'laboratory-rooms.html':  'rooms',
    'activity-log.html':      'activity',
    'room-logs.html':         'activity'
};

function renderTabs(groupKey) {
    var tabs = TAB_GROUPS[groupKey];
    var inner = tabs.map(function (t) {
        return '            <a href="' + t.href + '" class="page-tab">' + t.label + '</a>';
    }).join('\n');
    return '        <div class="page-tabs">\n' + inner + '\n        </div>';
}

const BREADCRUMB_REGEX = /(<div class="breadcrumb"[^>]*>[\s\S]*?<\/div>)/;
// Page-tabs has only flat <a> children, so the first </div> closes it. Don't consume neighbors.
const EXISTING_TABS_REGEX = /\n?[ \t]*<div class="page-tabs">[\s\S]*?<\/div>\n?/;

let updated = 0, skipped = 0;

Object.keys(PAGE_GROUP).forEach(function (file) {
    var filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) { console.log('SKIP (missing): ' + file); skipped++; return; }

    var content = fs.readFileSync(filePath, 'utf8');
    var group = PAGE_GROUP[file];
    var tabsHtml = renderTabs(group);

    // Remove existing page-tabs block (if any) to make this script idempotent
    content = content.replace(EXISTING_TABS_REGEX, '');

    if (!BREADCRUMB_REGEX.test(content)) {
        console.log('SKIP (no breadcrumb): ' + file);
        skipped++;
        return;
    }

    var next = content.replace(BREADCRUMB_REGEX, function (m) {
        return m + '\n\n' + tabsHtml;
    });

    fs.writeFileSync(filePath, next, 'utf8');
    console.log('OK: ' + file + ' (' + group + ')');
    updated++;
});

console.log('\nDone. Updated: ' + updated + ', Skipped: ' + skipped);
