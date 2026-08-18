export function getUsernameFromLocation(locationLike = window.location) {
  const match = locationLike.pathname.match(/^\/users\/([^/]+)\/?$/);
  if (match) return decodeURIComponent(match[1]);
  return new URLSearchParams(locationLike.search).get('username');
}

export function getRepositoryFromLocation(locationLike = window.location) {
  const match = locationLike.pathname.match(/^\/repositories\/([^/]+)\/([^/]+)\/?$/);
  if (match) {
    return { owner: decodeURIComponent(match[1]), repository: decodeURIComponent(match[2]) };
  }

  const params = new URLSearchParams(locationLike.search);
  return { owner: params.get('owner'), repository: params.get('repository') };
}

export function userRoute(username) {
  return `/users/${encodeURIComponent(username)}`;
}

export function repositoryRoute(owner, repository) {
  return `/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
}
