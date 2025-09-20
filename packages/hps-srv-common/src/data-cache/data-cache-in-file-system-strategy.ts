import { promises as fsPromises } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { type DataCacheStrategy } from './data-cache-strategy.js';

export class DataCacheInFileSystemStrategy implements DataCacheStrategy {
  constructor(
    private cacheDir: string,
    private cacheFileExt = '.cache'
  ) {
    this.cacheDir = resolve(process.cwd(), cacheDir);
  }

  async set<T>(key: string, value: T): Promise<void> {
    const cachePath = this.getCacheFilePath(key);
    const tempPath = `${cachePath}.${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const cacheData = JSON.stringify(value);
    // create nest directory
    await fsPromises.mkdir(dirname(cachePath), {
      recursive: true,
    });
    try {
      // Write to temp file first
      await fsPromises.writeFile(tempPath, cacheData, { flush: true });
      // Rename temp file to cache file
      await fsPromises.rename(tempPath, cachePath);
    } catch (error) {
      // Remove temp file if rename failed
      await fsPromises.unlink(tempPath).catch(() => {});
      throw error;
    }
  }

  get<T>(key: string): T | undefined;
  get<T>(key: string, getDefault?: () => Promise<T> | T): Promise<T>;
  async get<T>(
    key: string,
    getDefault?: () => Promise<T> | T
  ): Promise<Promise<Promise<Promise<T> | T | undefined>>> {
    const cacheData = await this.getFromCache<T>(key);
    if (cacheData) {
      return cacheData;
    } else if (getDefault) {
      const defaultData = await getDefault();
      await this.set(key, defaultData);
      return defaultData;
    } else {
      return undefined;
    }
  }

  async delete(key: string): Promise<void> {
    const cachePath = this.getCacheFilePath(key);
    try {
      await fsPromises.unlink(cachePath);
    } catch {
      // Handle file deletion errors
    }
  }

  async clear(): Promise<void> {
    try {
      await fsPromises.rm(this.cacheDir, { recursive: true });
    } catch {
      // Handle cache directory deletion errors
    }
  }

  private getCacheFilePath(key: string): string {
    return join(this.cacheDir, `${key}${this.cacheFileExt}`);
  }

  private async getFromCache<T>(key: string): Promise<T | undefined> {
    const cachePath = this.getCacheFilePath(key);
    try {
      const cacheData = await fsPromises.readFile(cachePath, 'utf8');
      return JSON.parse(cacheData);
    } catch {
      // Handle file not found or JSON parsing
      return undefined;
    }
  }
}
