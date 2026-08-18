import { pt } from './pt.js';
import { en } from './en.js';

const translations = { pt, en };
const LANGUAGE_KEY = 'github-explorer-language';
let currentLanguage = 'pt';
const listeners = new Set();

export function initializeLanguage() {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  const browserLanguage = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'pt';
  currentLanguage = translations[saved] ? saved : browserLanguage;
  document.documentElement.lang = currentLanguage === 'pt' ? 'pt-BR' : 'en';
  translateDocument();
}

export function setLanguage(language) {
  if (!translations[language]) return;
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  translateDocument();
  listeners.forEach((listener) => listener(language));
}

export function getLanguage() { return currentLanguage; }
export function getLocale() { return currentLanguage === 'pt' ? 'pt-BR' : 'en-US'; }
export function onLanguageChange(listener) { listeners.add(listener); return () => listeners.delete(listener); }

export function t(path) {
  return path.split('.').reduce((current, key) => current?.[key], translations[currentLanguage]) ?? path;
}

export function translateDocument(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.classList.toggle('active', button.dataset.language === currentLanguage);
    button.setAttribute('aria-pressed', String(button.dataset.language === currentLanguage));
  });
}
