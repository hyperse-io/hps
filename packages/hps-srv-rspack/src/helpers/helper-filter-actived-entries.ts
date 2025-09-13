import {
  arraysIntersect,
  normalizeSemicolonFilterParts,
} from '@hyperse/hps-srv-common';
import { type EvolveEntryMap } from '../types/types-entry-map.js';
import { resolveEntryMapInputFiles } from './helper-resolve-entry-map-input-files.js';

/**
 * Filter to find actived entry input by entry name filter.
 * @param definedEntries
 * @param modules `home;mine;`
 * @returns activedEntries
 */
export const filterActivedEntriesByModule = (
  definedEntries: EvolveEntryMap,
  modules: Array<string | RegExp>
): EvolveEntryMap => {
  const patterns = normalizeSemicolonFilterParts(modules);
  const newActivedEntries: EvolveEntryMap = {};

  for (const [entryKey, itemConfig] of Object.entries(definedEntries)) {
    const matched = patterns.find((m) => {
      // Also need to support `numeric` named module.
      const testRegExp =
        typeof m === 'string' || typeof m === 'number' ? new RegExp(`${m}`) : m;
      return testRegExp.test(entryKey);
    });
    if (matched) {
      newActivedEntries[entryKey] = itemConfig;
    }
  }
  return newActivedEntries;
};

/**
 * Filter to find actived entry input by absolute entry filepath
 * @param projectCwd
 * @param definedEntries
 * @param entryInputs [`/xxxx/x/xxxx/src/home/index.tsx`]
 * @returns activedEntries
 */
export const filterActivedEntriesByEntryInputs = async (
  projectCwd: string,
  definedEntries: EvolveEntryMap,
  entryInputs: string[]
): Promise<EvolveEntryMap> => {
  const newActivedEntries: EvolveEntryMap = {};
  for (const [entryKey, itemConfig] of Object.entries(definedEntries)) {
    const entryAbsFiles = await resolveEntryMapInputFiles(projectCwd, {
      [entryKey]: itemConfig,
    });
    if (arraysIntersect(entryAbsFiles, entryInputs)) {
      newActivedEntries[entryKey] = itemConfig;
    }
  }
  return newActivedEntries;
};
