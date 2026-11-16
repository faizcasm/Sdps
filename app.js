document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-ready');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const readingControl = document.createElement('button');
readingControl.className = 'reading-toggle';
readingControl.type = 'button';
readingControl.setAttribute('aria-label', 'Increase text size');
readingControl.setAttribute('aria-pressed', 'false');
readingControl.innerHTML = '<span>A</span><small>+</small>';
document.querySelector('.site-header')?.append(readingControl);

const savedReadingMode = localStorage.getItem('springdales-reading-mode') === 'large';
if (savedReadingMode) {
  document.documentElement.classList.add('large-type');
  readingControl.setAttribute('aria-pressed', 'true');
}

readingControl.addEventListener('click', () => {
  const enabled = document.documentElement.classList.toggle('large-type');
  readingControl.setAttribute('aria-pressed', String(enabled));
  readingControl.setAttribute('aria-label', enabled ? 'Reset text size' : 'Increase text size');
  localStorage.setItem('springdales-reading-mode', enabled ? 'large' : 'normal');
});

if (menuButton && nav) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('is-open') && !nav.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const setHeaderState = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
};
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
