// ============================================================
//  AETHRYA WEB PORTAL — Sidebar Navigation
//  Accordion sub-menu expansion + mobile hamburger toggle
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initSidebarNav();
  initMobileToggle();
  initSearchFilter();
});

/* ---- Accordion Navigation ---- */
function initSidebarNav() {
  const allSubmenuToggles = document.querySelectorAll('.has-submenu > .nav-link, .has-submenu-nested > .nav-link-nested');

  allSubmenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.parentElement;
      const isNested = parent.classList.contains('has-submenu-nested');

      if (!isNested) {
        // Close other top-level open items (accordion behavior)
        document.querySelectorAll('.nav-item.has-submenu.open').forEach(other => {
          if (other !== parent) {
            other.classList.remove('open');
          }
        });
      }

      // Toggle current item
      parent.classList.toggle('open');
    });
  });

  // Set active state based on current page
  highlightActivePage();
}

/* ---- Highlight Active Page ---- */
function highlightActivePage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-submenu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
      link.classList.add('active');

      // If it's a submenu item, open its parent
      const parentItem = link.closest('.nav-item.has-submenu');
      if (parentItem) {
        parentItem.classList.add('open');
      }
    }
  });

  // Default: highlight HOME on the root page
  if (currentPath === '/' || currentPath === '/index.html') {
    const homeLink = document.querySelector('.nav-link[data-section="home"]');
    if (homeLink) homeLink.classList.add('active');
  }
}

/* ---- Mobile Hamburger Toggle ---- */
function initMobileToggle() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('visible');
    toggle.classList.toggle('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    toggle.classList.remove('active');
  });
}

/* ---- Search Filter ---- */
function initSearchFilter() {
  const searchInput = document.querySelector('.sidebar-search input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const navItems = document.querySelectorAll('.nav-item');

    if (!query) {
      // Show all items, collapse sub-menus
      navItems.forEach(item => {
        item.style.display = '';
        item.classList.remove('open');
      });
      return;
    }

    navItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const matches = text.includes(query);
      item.style.display = matches ? '' : 'none';

      // Auto-expand matching items with sub-menus
      if (matches && item.classList.contains('has-submenu')) {
        item.classList.add('open');
      }
    });
  });
}
