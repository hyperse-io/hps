import type { DataCacheStrategy } from './data-cache-strategy.js';
import { MemoryCache } from './memory-cache.js';

/**
 * @description
 * The cache size can be configured by passing a different number to the constructor
 * function.
 */
export class DataCacheInMemoryStrategy implements DataCacheStrategy {
  private readonly cache: MemoryCache;

  constructor(cacheSize?: number) {
    this.cache = new MemoryCache(cacheSize);
  }

  delete(sessionToken: string) {
    this.cache.delete(sessionToken);
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, getDefault?: () => Promise<T> | T): Promise<T>;
  get<T>(
    key: string,
    getDefault?: () => Promise<T> | T
  ): Promise<T> | T | undefined {
    return this.cache.get(key, getDefault);
  }

  set<T>(key: string, value: T) {
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}
