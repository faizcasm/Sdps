document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-ready');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Preferences remain optional when storage is unavailable.
    }
  }
};

const readingControl = document.createElement('button');
readingControl.className = 'reading-toggle';
readingControl.type = 'button';
readingControl.setAttribute('aria-label', 'Increase text size');
readingControl.setAttribute('aria-pressed', 'false');
readingControl.innerHTML = '<span>A</span><small>+</small>';
document.querySelector('.site-header')?.append(readingControl);

const savedReadingMode = storage.get('springdales-reading-mode') === 'large';
if (savedReadingMode) {
  document.documentElement.classList.add('large-type');
  readingControl.setAttribute('aria-pressed', 'true');
}

readingControl.addEventListener('click', () => {
  const enabled = document.documentElement.classList.toggle('large-type');
  readingControl.setAttribute('aria-pressed', String(enabled));
  readingControl.setAttribute('aria-label', enabled ? 'Reset text size' : 'Increase text size');
  storage.set('springdales-reading-mode', enabled ? 'large' : 'normal');
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

document.querySelectorAll('[data-copy-value]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy-value');
    const status = button.parentElement?.querySelector('[data-copy-status]');
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = 'Copied';
    } catch {
      if (status) status.textContent = 'Select and copy the address';
    }
    window.setTimeout(() => {
      if (status) status.textContent = '';
    }, 2200);
  });
});

const checklist = document.querySelector('[data-checklist]');
if (checklist) {
  const key = 'springdales-admission-checklist';
  let saved = {};
  try {
    saved = JSON.parse(storage.get(key) || '{}');
  } catch {
    saved = {};
  }
  const items = [...checklist.querySelectorAll('input[type="checkbox"]')];
  const progress = checklist.querySelector('[data-checklist-progress]');
  const updateChecklist = () => {
    const completed = items.filter((item) => item.checked).length;
    items.forEach((item) => { saved[item.id] = item.checked; });
    storage.set(key, JSON.stringify(saved));
    if (progress) progress.textContent = `${completed} of ${items.length} complete`;
  };
  items.forEach((item) => {
    item.checked = saved[item.id] === true;
    item.addEventListener('change', updateChecklist);
  });
  updateChecklist();
}

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
