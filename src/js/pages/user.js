import { initializeCommonUi } from '../common.js';
import { getUser, getUserRepositories, classifyGitHubError } from '../api/github-api.js';
import { getLocale, onLanguageChange, t } from '../i18n/i18n.js';
import { formatDate, formatNumber } from '../utils/formatters.js';
import { sortRepositories } from '../utils/repository-sort.js';
import { getUsernameFromLocation, repositoryRoute } from '../utils/routes.js';

initializeCommonUi();

const username = getUsernameFromLocation();
const controller = new AbortController();
let user = null;
let repositories = [];
let currentSort = 'starsDesc';
let currentErrorType = null;

const loading = document.querySelector('#user-loading');
const content = document.querySelector('#user-content');
const errorSection = document.querySelector('#user-error');
const list = document.querySelector('#repository-list');
const empty = document.querySelector('#empty-repositories');
const sortSelect = document.querySelector('#repository-sort');

function showError(type) {
  currentErrorType = type;
  loading.hidden = true;
  content.hidden = true;
  errorSection.hidden = false;

  const map = {
    'not-found': ['errors.userNotFound', 'errors.userNotFoundDescription'],
    'rate-limit': ['errors.rateLimit', 'errors.rateLimitDescription'],
    generic: ['errors.generic', 'errors.genericDescription']
  };
  const [titleKey, descriptionKey] = map[type] ?? map.generic;
  document.querySelector('#error-title').textContent = t(titleKey);
  document.querySelector('#error-description').textContent = t(descriptionKey);
}

function fillUserProfile() {
  document.title = `${user.name ?? user.login} | GitHub Explorer`;
  const avatar = document.querySelector('#user-avatar');
  avatar.src = user.avatar_url;
  avatar.alt = `${user.name ?? user.login} avatar`;
  document.querySelector('#user-name').textContent = user.name ?? user.login;
  document.querySelector('#user-login').textContent = `@${user.login}`;
  document.querySelector('#user-bio').textContent = user.bio ?? '—';
  document.querySelector('#user-followers').textContent = formatNumber(user.followers, getLocale());
  document.querySelector('#user-following').textContent = formatNumber(user.following, getLocale());
  document.querySelector('#user-email').textContent = user.email ?? t('common.notInformed');
  const profileLink = document.querySelector('#user-github-link');
  profileLink.href = user.html_url;
  profileLink.textContent = `github.com/${user.login}`;
}

function createRepositoryCard(repository) {
  const article = document.createElement('article');
  article.className = 'repository-card app-card';

  const top = document.createElement('div');
  top.className = 'repository-card-top';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'repository-title-wrap';
  const heading = document.createElement('h3');
  const link = document.createElement('a');
  link.className = 'repository-title';
  link.href = repositoryRoute(repository.owner.login, repository.name);
  link.textContent = repository.name;
  heading.append(link);

  const description = document.createElement('p');
  description.className = 'repository-description';
  description.textContent = repository.description ?? '—';
  titleWrap.append(heading, description);

  const stars = document.createElement('span');
  stars.className = 'star-count';
  stars.textContent = `★ ${formatNumber(repository.stargazers_count, getLocale())}`;
  top.append(titleWrap, stars);

  const bottom = document.createElement('div');
  bottom.className = 'repository-card-bottom';
  const meta = document.createElement('div');
  meta.className = 'repository-meta';

  const language = document.createElement('span');
  language.textContent = `● ${repository.language ?? '—'}`;
  const updated = document.createElement('span');
  updated.textContent = `${t('common.updated')}: ${formatDate(repository.updated_at, getLocale())}`;
  meta.append(language, updated);

  const details = document.createElement('a');
  details.className = 'details-link';
  details.href = repositoryRoute(repository.owner.login, repository.name);
  details.textContent = `${t('common.details')} →`;
  bottom.append(meta, details);

  article.append(top, bottom);
  return article;
}

function renderRepositories() {
  const sorted = sortRepositories(repositories, currentSort);
  list.replaceChildren(...sorted.map(createRepositoryCard));
  empty.hidden = repositories.length !== 0;
  list.hidden = repositories.length === 0;
  document.querySelector('#repository-count').textContent = String(repositories.length);
  document.querySelector('#repository-count-text').textContent = String(repositories.length);
}

function rerenderLocalizedData() {
  if (currentErrorType) {
    showError(currentErrorType);
    return;
  }
  if (!user) return;
  fillUserProfile();
  renderRepositories();
}

async function load() {
  if (!username) {
    showError('not-found');
    return;
  }

  try {
    [user, repositories] = await Promise.all([
      getUser(username, { signal: controller.signal }),
      getUserRepositories(username, { signal: controller.signal })
    ]);
    currentErrorType = null;
    fillUserProfile();
    renderRepositories();
    loading.hidden = true;
    content.hidden = false;
  } catch (error) {
    const type = classifyGitHubError(error);
    if (type !== 'cancelled') showError(type);
  }
}

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  renderRepositories();
});

onLanguageChange(rerenderLocalizedData);
window.addEventListener('pagehide', () => controller.abort(), { once: true });
load();
