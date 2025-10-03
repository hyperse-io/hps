import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { getNcuCacheFile } from './cache.js';

/**
 * Write the ncu config file
 * @param cwd - The current working directory
 */
export const writeNcuConfig = (cwd: string) => {
  const ncuConfigFile = join(cwd, '.ncurc.json');

  if (!existsSync(ncuConfigFile)) {
    writeFileSync(
      ncuConfigFile,
      JSON.stringify(
        {
          dep: ['prod', 'dev', 'optional', 'packageManager'],
          reject: [],
        },
        null,
        2
      )
    );
  }
  return ncuConfigFile;
};

/**
 * Write the ncu cache file
 * @param force - Whether to force the cache file to be written
 */
export const writeCacheFile = (force?: boolean) => {
  const cacheFile = getNcuCacheFile();
  if (force && existsSync(cacheFile)) {
    rmSync(cacheFile);
  }

  if (!existsSync(cacheFile)) {
    mkdirSync(dirname(cacheFile), {
      recursive: true,
    });
  }
  return cacheFile;
};
