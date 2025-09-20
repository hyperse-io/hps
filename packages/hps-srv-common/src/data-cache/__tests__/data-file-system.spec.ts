import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataCacheInFileSystemStrategy } from '../data-cache-in-file-system-strategy.js';

const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};

describe('DataCacheInFileSystemStrategy', () => {
  const cacheDir = getDirname(import.meta.url, './cache');
  const cacheStrategy = new DataCacheInFileSystemStrategy(cacheDir);

  afterEach(async () => {
    // 清除缓存，以便每次测试之间的隔离
    await cacheStrategy.clear();
  });

  test('set and get', async () => {
    const key = 'Key';
    const value = 'testValue';

    // 设置缓存
    await cacheStrategy.set(key, value);

    // 获取缓存
    const result = await cacheStrategy.get<string>(key);

    expect(result).toBe(value);
  });

  test('get with default value', async () => {
    const key = 'testKey';

    // 定义获取默认值的函数
    const getDefault = () => 'defaultValue';

    // 获取缓存，如果不存在，则使用默认值
    const result = await cacheStrategy.get<string>(key, getDefault);

    expect(result).toBe('defaultValue');
  });

  test('delete', async () => {
    const key = 'testKey';
    const value = 'testValue';

    // 设置缓存
    await cacheStrategy.set(key, value);

    // 删除缓存
    await cacheStrategy.delete(key);

    // 重新获取缓存，应该返回 undefined
    const result = await cacheStrategy.get<string>(key);

    expect(result).toBeUndefined();
  });

  test('clear', async () => {
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';

    // 设置两个缓存项
    await cacheStrategy.set(key1, value1);
    await cacheStrategy.set(key2, value2);

    // 清除缓存
    await cacheStrategy.clear();

    // 重新获取缓存，应该返回 undefined
    const result1 = await cacheStrategy.get<string>(key1);
    const result2 = await cacheStrategy.get<string>(key2);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});

describe('DataCacheInFileSystemStrategy for file system stratety', () => {
  const cacheDir = getDirname(import.meta.url, './cache1');

  const cacheStrategy = new DataCacheInFileSystemStrategy(cacheDir);

  afterEach(async () => {
    // 清除缓存，以便每次测试之间的隔离
    await cacheStrategy.clear();
  });

  test('set and get', async () => {
    const key = 'Key';
    const value = 'testValue';

    // 设置缓存
    await cacheStrategy.set(key, value);

    // 获取缓存
    const result = await cacheStrategy.get<string>(key);

    expect(result).toBe(value);
  });

  test('get with default value', async () => {
    const key = 'testKey';

    // 定义获取默认值的函数
    const getDefault = async () => 'defaultValue';

    // 获取缓存，如果不存在，则使用默认值
    const result = await cacheStrategy.get<string>(key, getDefault);

    expect(result).toBe('defaultValue');
  });

  test('delete', async () => {
    const key = 'testKey';
    const value = 'testValue';

    // 设置缓存
    await cacheStrategy.set(key, value);

    // 删除缓存
    await cacheStrategy.delete(key);

    // 重新获取缓存，应该返回 undefined
    const result = await cacheStrategy.get<string>(key);

    expect(result).toBeUndefined();
  });

  test('clear', async () => {
    const key1 = 'testKey1';
    const value1 = 'testValue1';
    const key2 = 'testKey2';
    const value2 = 'testValue2';

    // 设置两个缓存项
    await cacheStrategy.set(key1, value1);
    await cacheStrategy.set(key2, value2);

    // 清除缓存
    await cacheStrategy.clear();

    // 重新获取缓存，应该返回 undefined
    const result1 = await cacheStrategy.get<string>(key1);
    const result2 = await cacheStrategy.get<string>(key2);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
