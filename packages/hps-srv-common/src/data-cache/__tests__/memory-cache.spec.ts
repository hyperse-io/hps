import { MemoryCache } from '../memory-cache.js';

describe('memory cache', () => {
  let cache: MemoryCache;
  let cache2: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache();
    cache2 = new MemoryCache();
  });

  it('stores and retrieves a multiple values', () => {
    cache.set('test', 1);
    cache.set('test2', 2);
    expect(cache.get('test')).toBe(1);
    expect(cache.get('test2')).toBe(2);
  });

  it('uses getDefault function', async () => {
    const result = cache.get('test', async () => Promise.resolve('foo'));

    async function test() {
      try {
        await cache.get('test2', async () => {
          throw new Error('111');
        });
      } catch (err) {
        throw new Error('111' + (err as Error).message);
      }
    }
    expect(result instanceof Promise).toBe(true);
    expect(() => {
      return cache.get('testsync', () => {
        throw new Error('testsync');
      });
    }).toThrow(new Error('testsync'));

    await expect(async () => {
      return await cache.get('testAsync', async () => {
        throw new Error('testAsync');
      });
    }).rejects.toThrow(new Error('testAsync'));

    await expect(test()).rejects.toMatchObject({
      message: '111111',
    });
    expect(await result).toBe('foo');
  });

  it('uses separate stores per context', () => {
    cache.set('test', 1);
    cache2.set('test', 2);

    expect(cache.get('test')).toBe(1);
    expect(cache2.get('test')).toBe(2);
  });
});
