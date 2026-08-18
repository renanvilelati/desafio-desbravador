import { initializeCommonUi } from '../common.js';
import { classifyGitHubError, getRepository } from '../api/github-api.js';
import { getLocale, onLanguageChange, t } from '../i18n/i18n.js';
import { formatDate, formatNumber } from '../utils/formatters.js';
import { getRepositoryFromLocation, userRoute } from '../utils/routes.js';

initializeCommonUi();

const params = getRepositoryFromLocation();
const controller = new AbortController();
let repository = null;
let currentErrorType = null;

const loading = document.querySelector('#repository-loading');
const content = document.querySelector('#repository-content');
const errorSection = document.querySelector('#repository-error');

function showError(type) {
  currentErrorType = type;
  loading.hidden = true;
  content.hidden = true;
  errorSection.hidden = false;
  const map = {
    'not-found': ['errors.repositoryNotFound', 'errors.repositoryNotFoundDescription'],
    'rate-limit': ['errors.rateLimit', 'errors.rateLimitDescription'],
    generic: ['errors.generic', 'errors.genericDescription']
  };
  const [titleKey, descriptionKey] = map[type] ?? map.generic;
  document.querySelector('#repo-error-title').textContent = t(titleKey);
  document.querySelector('#repo-error-description').textContent = t(descriptionKey);
}

function renderRepository() {
  if (!repository) return;
  document.title = `${repository.full_name} | GitHub Explorer`;

  const back = document.querySelector('#back-to-user');
  back.href = userRoute(repository.owner.login);
  document.querySelector('#back-user-name').textContent = `@${repository.owner.login}`;

  document.querySelector('#repo-owner').textContent = repository.owner.login;
  document.querySelector('#repo-name').textContent = repository.name;
  const description = repository.description ?? '—';
  document.querySelector('#repo-description').textContent = description;
  document.querySelector('#repo-about-description').textContent = description;
  document.querySelector('#repo-stars').textContent = formatNumber(repository.stargazers_count, getLocale());
  document.querySelector('#repo-language').textContent = repository.language ?? '—';
  document.querySelector('#repo-forks').textContent = formatNumber(repository.forks_count, getLocale());
  document.querySelector('#repo-full-name').textContent = repository.full_name;
  document.querySelector('#repo-full-name-detail').textContent = repository.full_name;
  document.querySelector('#repo-updated').textContent = formatDate(repository.updated_at, getLocale());
  document.querySelector('#repo-external-link').href = repository.html_url;
}

async function load() {
  if (!params.owner || !params.repository) {
    showError('not-found');
    return;
  }

  try {
    repository = await getRepository(params.owner, params.repository, { signal: controller.signal });
    currentErrorType = null;
    renderRepository();
    loading.hidden = true;
    content.hidden = false;
  } catch (error) {
    const type = classifyGitHubError(error);
    if (type !== 'cancelled') showError(type);
  }
}

onLanguageChange(() => {
  if (currentErrorType) showError(currentErrorType);
  else renderRepository();
});
window.addEventListener('pagehide', () => controller.abort(), { once: true });
load();
