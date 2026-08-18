import axios from 'axios';
import { getCached, setCached } from '../utils/cache.js';

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 12000,
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2026-03-10'
  }
});

export async function getUser(username, { signal } = {}) {
  const normalized = username.trim().toLowerCase();
  const cacheKey = `user:${normalized}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await githubApi.get(`/users/${encodeURIComponent(normalized)}`, { signal });
  setCached(cacheKey, data);
  return data;
}

export async function getUserRepositories(username, { signal } = {}) {
  const normalized = username.trim().toLowerCase();
  const cacheKey = `repos:${normalized}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const repositories = [];
  let page = 1;

  while (true) {
    const { data } = await githubApi.get(`/users/${encodeURIComponent(normalized)}/repos`, {
      params: { per_page: 100, page, type: 'owner' },
      signal
    });
    repositories.push(...data);
    if (data.length < 100) break;
    page += 1;
  }

  setCached(cacheKey, repositories);
  return repositories;
}

export async function getRepository(owner, repository, { signal } = {}) {
  const cacheKey = `repo:${owner.toLowerCase()}/${repository.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { data } = await githubApi.get(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`, { signal });
  setCached(cacheKey, data);
  return data;
}

export function classifyGitHubError(error) {
  if (axios.isCancel(error) || error?.name === 'CanceledError') return 'cancelled';
  if (error?.response?.status === 404) return 'not-found';
  if (error?.response?.status === 403 || error?.response?.status === 429) return 'rate-limit';
  return 'generic';
}
