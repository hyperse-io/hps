const MEMORY_CACHE = {};

/**
 * The memory cache utilities.
 */
export class MemoryCache {
  private readonly caches = new WeakMap();
  private readonly cacheSize: number = 1000;

  constructor(cacheSize = 1000) {
    if (cacheSize != null) {
      if (cacheSize < 1) {
        throw new Error(`cacheSize must be a positive integer`);
      }
      this.cacheSize = Math.round(cacheSize);
    }
  }

  set<T>(key: string, val: T): void {
    const ctxCache = this.getContextCache();
    ctxCache.set(key, val);
    if (ctxCache.size === this.cacheSize) {
      // evict oldest
      ctxCache.delete(this.first() as string);
    }
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, getDefault?: () => Promise<T> | T): Promise<T>;
  get<T>(
    key: string,
    getDefault?: () => Promise<T> | T
  ): Promise<T> | T | undefined {
    const ctxCache = this.getContextCache();
    const result = ctxCache.get(key);
    if (result) {
      return result as Promise<T> | T | undefined;
    }
    if (getDefault) {
      const defaultResultOrPromise = getDefault();
      // we can also cache an promise reference in Map.
      ctxCache.set(key, defaultResultOrPromise);
      return defaultResultOrPromise;
    } else {
      return;
    }
  }

  delete(key: string) {
    this.set(key, null);
  }

  clear() {
    const ctxCache = this.getContextCache();
    const keys = ctxCache.keys();
    for (const key of keys) {
      this.set(key, null);
    }
  }

  private first() {
    const ctxCache = this.getContextCache();
    return ctxCache.keys().next().value;
  }

  private getContextCache(): Map<string, unknown> {
    let ctxCache = this.caches.get(MEMORY_CACHE);
    if (!ctxCache) {
      ctxCache = new Map<string, unknown>();
      this.caches.set(MEMORY_CACHE, ctxCache);
    }
    return ctxCache;
  }
}
