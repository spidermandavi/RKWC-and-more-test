const menuButton = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');

if (menuButton && menuPanel) {
  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuPanel.classList.toggle('open', open);
  };

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
    if (event.key === 'Escape') setOpen(false);
  });
}
