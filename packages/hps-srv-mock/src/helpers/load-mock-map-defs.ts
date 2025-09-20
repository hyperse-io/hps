import { posix } from 'node:path';
import { fileWalk } from '@armit/file-utility';
import { arrayUnique } from '@hyperse/hps-srv-common';
import {
  type HpsMockMapItem,
  type HpsMockOptions,
} from '../types/types-options.js';
import { getMockCwd } from './get-mock-cwd.js';
import { slashFix } from './slash-fix.js';

export const loadMockMapItemDefFiles = async (
  mockCwd: string,
  mockMapItem: HpsMockMapItem,
  mockOptions: HpsMockOptions
) => {
  const mockFilters = mockOptions.mockFilters || [];
  const wildcardDefs = mockOptions.mockMap!['/*']?.defs || [];
  const defFolders = (mockMapItem.defs || []).concat(wildcardDefs);

  const searchPattern = defFolders
    .filter((folderName) => {
      // If key is `/*` always attached it's defined mock def files, ignore `mockFilters`
      if (wildcardDefs.includes(folderName)) {
        return true;
      }

      // If not mock filters defined ignore it return all
      if (mockFilters.length) {
        const matched = mockFilters.find((m) => {
          const testRegExp = typeof m === 'string' ? new RegExp(`${m}`) : m;
          return testRegExp.test(folderName);
        });
        return !!matched;
      }
      // otherwise return all
      return true;
    })
    .map((folderName) => slashFix(posix.join(folderName, '**/*.{js,ts}')));

  // To support window slash paths.
  const result = await fileWalk(searchPattern, {
    cwd: mockCwd,
    absolute: true,
    // mock folder look up deepth.
    deep: mockMapItem.defsDeep || 1,
  });

  // To unique duplicated results
  return arrayUnique(result);
};

export const loadMockMapDefEntryFiles = async (
  mockOptions: HpsMockOptions
): Promise<string[]> => {
  const mockCwd = getMockCwd(mockOptions);
  const mockMap = mockOptions.mockMap || {};
  const mockEntryFiles: string[] = [];
  for (const [, mockMapItem] of Object.entries(mockMap)) {
    // Remove duplicated map item def files, because we may add the `same` def folder in each entryMapItem
    // e.g. `common`
    const mockMapItemDefFiles = await loadMockMapItemDefFiles(
      mockCwd,
      mockMapItem,
      mockOptions
    );
    mockEntryFiles.push(...mockMapItemDefFiles);
  }
  // To unique duplicated results
  return arrayUnique(mockEntryFiles);
};
