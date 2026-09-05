const menuButton = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');
const navLinks = document.querySelectorAll('.main-nav a');

// Keep the main navigation consistent on every page.
const pageMap = {
  home: 'index.html',
  championship: 'tournament.html',
  about: 'rules.html',
  community: 'community.html'
};

navLinks.forEach(link => {
  const label = link.textContent.trim().toLowerCase();
  if (label === 'home') link.href = pageMap.home;
  if (label === 'championship') link.href = pageMap.championship;
  if (label === 'about rk') link.href = pageMap.about;
  if (label === 'community') link.href = pageMap.community;
});

// Set the correct active state from the current page instead of relying on
// duplicated markup, while preserving the homepage styling.
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const activePage = currentPage === 'index.html'
  ? 'index.html'
  : currentPage === 'tournament.html'
    ? 'tournament.html'
    : currentPage === 'rules.html'
      ? 'rules.html'
      : currentPage === 'community.html'
        ? 'community.html'
        : null;

navLinks.forEach(link => {
  const isActive = activePage !== null && link.getAttribute('href') === activePage;
  link.classList.toggle('active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

if (menuButton && menuPanel) {
  // Accessibility relationships for the expandable menu.
  if (!menuPanel.id) menuPanel.id = 'rk-menu-panel';
  menuButton.setAttribute('aria-controls', menuPanel.id);
  menuButton.setAttribute('aria-haspopup', 'true');

  let lastFocusedElement = null;

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuPanel.setAttribute('aria-hidden', String(!open));
    menuPanel.classList.toggle('open', open);

    if (open) {
      lastFocusedElement = document.activeElement;
      const firstLink = menuPanel.querySelector('a[href]');
      if (firstLink) firstLink.focus();
    } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  const trapFocus = (event) => {
    if (event.key !== 'Tab' || !menuPanel.classList.contains('open')) return;

    const focusable = [...menuPanel.querySelectorAll(focusableSelector)]
      .filter(element => element.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  setOpen(false);

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menuPanel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!menuPanel.contains(event.target) && !menuButton.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      menuButton.focus();
      return;
    }
    trapFocus(event);
  });

  // Close the menu when moving to a larger desktop layout after opening it.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && menuButton.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
    }
  });
}

// Shared visual/accessibility corrections that belong to every page.
const sharedFixes = document.createElement('style');
sharedFixes.textContent = `
  .site-header{position:sticky;top:0;}
  .menu-panel{top:calc(100% + 1px);max-height:calc(100vh - 120px);overflow-y:auto;overscroll-behavior:contain;}
  .menu-toggle{position:relative;transition:border-color .2s ease,background .2s ease;}
  .menu-toggle:focus-visible,.main-nav a:focus-visible,.header-cta:focus-visible,.menu-panel a:focus-visible,.footer a:focus-visible,.button:focus-visible,.text-link:focus-visible,.outline-button:focus-visible,.back-link:focus-visible{outline:2px solid var(--gold);outline-offset:4px;}
  .menu-toggle span{transition:transform .2s ease,opacity .2s ease;transform-origin:center;}
  .menu-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(6px) rotate(45deg);}
  .menu-toggle[aria-expanded="true"] span:nth-child(2){opacity:0;}
  .menu-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}
  .menu-panel a:last-child{border-bottom:0;}
  @media(max-width:560px){
    .menu-panel{max-height:calc(100vh - 108px);}
    .menu-panel a{padding:14px 18px;}
    .menu-panel-head{padding:16px 18px 12px;}
  }
  @media(prefers-reduced-motion:reduce){
    html{scroll-behavior:auto;}
    .menu-toggle,.menu-toggle span,.menu-panel{transition:none!important;}
  }
`;
document.head.appendChild(sharedFixes);
