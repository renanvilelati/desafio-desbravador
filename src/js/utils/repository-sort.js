export const repositorySorters = {
  starsDesc: (a, b) => b.stargazers_count - a.stargazers_count,
  starsAsc: (a, b) => a.stargazers_count - b.stargazers_count,
  nameAsc: (a, b) => a.name.localeCompare(b.name),
  nameDesc: (a, b) => b.name.localeCompare(a.name),
  updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
};

export function sortRepositories(repositories, sort = 'starsDesc') {
  const sorter = repositorySorters[sort] ?? repositorySorters.starsDesc;
  return [...repositories].sort(sorter);
}
