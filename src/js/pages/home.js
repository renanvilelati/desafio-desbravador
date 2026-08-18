import { initializeCommonUi } from '../common.js';
import { userRoute } from '../utils/routes.js';
import { onLanguageChange, t } from '../i18n/i18n.js';

initializeCommonUi();

const form = document.querySelector('#search-form');
const input = document.querySelector('#username');
const error = document.querySelector('#search-error');

function navigateToUser(username) {
  const value = username.trim();
  if (!value) {
    error.textContent = t('home.required');
    error.hidden = false;
    input.focus();
    return;
  }
  window.location.assign(userRoute(value));
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  navigateToUser(input.value);
});

document.querySelectorAll('[data-example-user]').forEach((button) => {
  button.addEventListener('click', () => navigateToUser(button.dataset.exampleUser));
});

input.addEventListener('input', () => { error.hidden = true; });

onLanguageChange(() => { if (!error.hidden) error.textContent = t('home.required'); });
