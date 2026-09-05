const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));

    if (!open) {
      nav.style.display = 'flex';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.padding = '18px 7vw 22px';
      nav.style.flexDirection = 'column';
      nav.style.gap = '0';
      nav.style.background = 'rgba(245,243,238,.98)';
      nav.style.borderBottom = '1px solid #d8d6cf';
      nav.style.boxShadow = '0 15px 30px rgba(16,25,35,.08)';
      nav.style.zIndex = '10';
      nav.querySelectorAll('a').forEach(link => { link.style.padding = '12px 0'; });
    } else {
      nav.style.display = 'none';
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      if (window.innerWidth <= 900) nav.style.display = 'none';
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      nav.removeAttribute('style');
    } else if (menuButton.getAttribute('aria-expanded') !== 'true') {
      nav.style.display = 'none';
    }
  });

  if (window.innerWidth <= 900) nav.style.display = 'none';
}
