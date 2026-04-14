/**
 * Auth guard for admin/lab tech pages. Include after data.js.
 * Redirects to login if no current user. Updates user profile in nav.
 */
function requireAuth() {
  // getCurrentUser is defined in supabase-data.js (uses sessionStorage)
  if (typeof getCurrentUser !== 'function') return;
  if (!getCurrentUser()) {
    var redirect = (window.location.pathname.split('/').pop() || 'index.html');
    window.location.replace('login.html?redirect=' + encodeURIComponent(redirect));
    return;
  }
  initAuthUI();
}
function initAuthUI() {
  var name = getCurrentUser();
  if (!name) return;
  var profile = document.querySelector('.user-profile');
  if (profile) {
    var initials = name.split(/\s+/).map(function(s){ return s[0]; }).join('').toUpperCase().slice(0, 2);
    var avatar = profile.querySelector('.user-avatar');
    if (avatar) avatar.textContent = initials;
    var nameEl = profile.querySelector('.user-name');
    if (nameEl) nameEl.textContent = name;
    var roleEl = profile.querySelector('.user-role');
    if (roleEl) roleEl.textContent = 'Lab Tech';
    var wrap = profile.querySelector('.user-info');
    if (wrap && !wrap.querySelector('.logout-link')) {
      var logout = document.createElement('a');
      logout.href = '#';
      logout.className = 'logout-link';
      logout.style.cssText = 'display:block;font-size:11px;color:#0d9488;margin-top:4px;';
      logout.textContent = 'Logout';
      logout.onclick = function(e){ e.preventDefault(); doLogout(); };
      wrap.appendChild(logout);
    }
    // Reveal after update to prevent flash of hardcoded values
    profile.style.visibility = 'visible';
  }
}

// Hide hardcoded nav profile immediately to prevent flash
(function() {
  var style = document.createElement('style');
  style.textContent = '.user-profile { visibility: hidden; }';
  document.head.appendChild(style);
})();
function doLogout() {
  if (typeof addAuditEntry === 'function' && typeof getCurrentUser === 'function') {
    var who = getCurrentUser();
    if (who) addAuditEntry('Logout', who + ' signed out');
  }
  if (typeof clearCurrentUser === 'function') clearCurrentUser();
  window.location.href = 'login.html';
}
document.addEventListener('DOMContentLoaded', function(){
  requireAuth();
  initMobileNav();
});

function initMobileNav() {
  var nav = document.querySelector('.top-nav-left');
  var sidebar = document.querySelector('.sidebar');
  if (!nav || !sidebar) return;

  // Inject hamburger button before the logo
  var btn = document.createElement('button');
  btn.className = 'hamburger-btn';
  btn.setAttribute('aria-label', 'Toggle navigation');
  btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  nav.insertBefore(btn, nav.firstChild);

  // Inject overlay
  var overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  // Close on nav link click (mobile UX)
  sidebar.querySelectorAll('.menu-item').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}
