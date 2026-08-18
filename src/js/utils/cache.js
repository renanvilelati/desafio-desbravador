const PREFIX = 'github-explorer-cache:';
const TTL = 5 * 60 * 1000;

export function getCached(key) {
  try {
    const raw = sessionStorage.getItem(`${PREFIX}${key}`);
    if (!raw) return null;
    const { value, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      sessionStorage.removeItem(`${PREFIX}${key}`);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function setCached(key, value) {
  try {
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify({ value, expiresAt: Date.now() + TTL }));
  } catch {
    // Cache is optional; ignore storage failures.
  }
}
