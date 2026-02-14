export function getUser<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function setUser(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearUser(key = "user") {
  localStorage.removeItem(key);
}
