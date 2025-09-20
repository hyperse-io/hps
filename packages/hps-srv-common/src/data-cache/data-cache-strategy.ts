/**
 * @description
 * This strategy defines how data get cached.
 */
export interface DataCacheStrategy {
  /**
   * @description
   * Store the data in the cache. When caching a data, the data
   * should not be modified apart from performing any transforms needed to
   * get it into a state to be stored, e.g. JSON.stringify().
   */
  set<T>(key: string, value: T, ttl?: number): void | Promise<void>;

  /**
   * @description
   * Retrieve the data from the cache
   */
  get<T>(key: string): T | undefined;
  get<T>(key: string, getDefault?: () => Promise<T> | T): Promise<T>;
  get<T>(
    key: string,
    getDefault?: () => Promise<T> | T
  ): Promise<T> | T | undefined;

  /**
   * @description
   * Delete a data from the cache
   */
  delete(key: string): void | Promise<void>;

  /**
   * @description
   * Clear the entire cache
   */
  clear(): void | Promise<void>;
}
