interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds = 3600): void {
  store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function makeCacheKey(...parts: string[]): string {
  return parts.map((p) => p.trim().toLowerCase()).join(":");
}
