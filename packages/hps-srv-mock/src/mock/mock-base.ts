import { type Request } from 'express';
import lodash, { type LoDashStatic } from 'lodash';
import mockjs, { type MockjsMock } from 'mockjs';
import {
  DataCacheInFileSystemStrategy,
  DataCacheInMemoryStrategy,
} from '@hyperse/hps-srv-common';

// global instance here
const memoryCache = new DataCacheInMemoryStrategy(10000);
const fileSystemCache = new DataCacheInFileSystemStrategy(
  './.cache/.db/',
  '.json'
);
/**
 * The basic class for all mock service of `ts` support.
 */
export class MockBase {
  constructor(
    private options: { strategy: 'Memory' | 'FileSystem' } = {
      strategy: 'Memory',
    }
  ) {}

  /**
   * The memory cache service, please Note you should always use `await` to use `cache` service
   * `fileSystem`, `memory`
   * @example
   * ```ts
   * await this.$cache.`get`/`set`/`clear`/`delete`()
   * ```
   */
  protected get $cache() {
    switch (this.options.strategy) {
      case 'Memory':
        return memoryCache;
      case 'FileSystem':
        return fileSystemCache;
      default:
        return memoryCache;
    }
  }

  /**
   * The global imports alias of `lodash`
   * @example
   * ```ts
   * this.$lodash.merge()
   * ```
   */
  protected get $lodash(): LoDashStatic {
    return lodash;
  }

  /**
   * A function to generate simulated data from the data template.
   * @link https://github.com/nuysoft/Mock/wiki/Mock.mock()
   * @example
   * ```ts
   * this.$mock({
   *   'title': 'Syntax Demo',
   *   'string1|1-10': '★',
   * })
   * ```
   */
  protected get $mock(): MockjsMock {
    return mockjs.mock;
  }

  /**
   * The global imports alias of `mockjs`
   * @example
   * ```ts
   * this.$mockjs.Random.email()
   * ```
   */
  protected get $mockjs(): typeof mockjs {
    return mockjs;
  }

  /**
   * Make the system wait `waitTimeInMs` milliseconds.
   * Note: if you want to use setTimeout() in your code directly, You must catch errors that occur in asynchronous code invoked by route handlers or middleware and pass them to Express for processing.
   * @example
   * ```ts
   *  setTimeout(() => {
   *   try {
   *     throw new Error('BROKEN')
   *   } catch (err) {
   *     next(err)
   *   }
   *, 100)
   * ```
   * @param waitTimeInMs
   */
  protected async $sleep(waitTimeInMs = 1000): Promise<void> {
    return await new Promise<void>((resolver) => {
      setTimeout(resolver, waitTimeInMs);
    });
  }

  protected $hostUri(req: Request): string {
    return req.app.get('hostUri') as string;
  }
}
