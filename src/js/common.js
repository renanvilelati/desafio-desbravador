import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/main.css';
import { initializeLanguage, setLanguage } from './i18n/i18n.js';
import { initializeTheme, toggleTheme } from './theme/theme.js';

export function initializeCommonUi() {
  initializeTheme();
  initializeLanguage();

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });

  document.querySelector('[data-theme-toggle]')?.addEventListener('click', toggleTheme);
}
