import { describe, expect, it } from 'vitest';
import { sortRepositories } from '../src/js/utils/repository-sort.js';

const repos = [
  { name: 'beta', stargazers_count: 2, updated_at: '2026-01-01T00:00:00Z' },
  { name: 'alpha', stargazers_count: 10, updated_at: '2026-03-01T00:00:00Z' },
  { name: 'gamma', stargazers_count: 5, updated_at: '2026-02-01T00:00:00Z' }
];

describe('sortRepositories', () => {
  it('orders by stars descending by default', () => {
    expect(sortRepositories(repos).map((repo) => repo.name)).toEqual(['alpha', 'gamma', 'beta']);
  });

  it('does not mutate the original array', () => {
    const original = [...repos];
    sortRepositories(repos, 'nameAsc');
    expect(repos).toEqual(original);
  });

  it('supports name and update sorting', () => {
    expect(sortRepositories(repos, 'nameAsc').map((repo) => repo.name)).toEqual(['alpha', 'beta', 'gamma']);
    expect(sortRepositories(repos, 'updated').map((repo) => repo.name)).toEqual(['alpha', 'gamma', 'beta']);
  });
});
