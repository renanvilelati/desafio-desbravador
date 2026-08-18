const THEME_KEY = 'github-explorer-theme';

export function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ?? (prefersDark ? 'dark' : 'light'), false);
}

export function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function getTheme() {
  return document.documentElement.getAttribute('data-bs-theme') ?? 'light';
}

export function applyTheme(theme, persist = true) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', normalized);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', normalized === 'dark' ? '#0b0f17' : '#f7f8fc');
  if (persist) localStorage.setItem(THEME_KEY, normalized);
  updateThemeButton();
}

export function updateThemeButton() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  const dark = getTheme() === 'dark';
  button.querySelector('[data-theme-icon]').textContent = dark ? '☀' : '☾';
  button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
}
