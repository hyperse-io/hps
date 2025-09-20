import fg from 'fast-glob';
import { existsSync, mkdirSync } from 'node:fs';
import { rmrfSyncByPattern } from '@armit/file-utility';
import { deleteEmpty } from '@hyperse/delete-empty-folders';
import { type HpsMockOptions } from '../types/types-options.js';
import { getMockCacheDir } from './get-mock-cache-dir.js';

export const cleanMockCacheDir = async (mockOptions: HpsMockOptions) => {
  let builtToCwd = getMockCacheDir(mockOptions);
  builtToCwd = fg.convertPathToPattern(builtToCwd);
  // remove mock cache files except `.db`
  rmrfSyncByPattern([builtToCwd], {
    ignore: ['**/.db/**'],
  });

  // delete empty folders
  await deleteEmpty(builtToCwd);

  if (!existsSync(builtToCwd)) {
    mkdirSync(builtToCwd, {
      recursive: true,
    });
  }
};
