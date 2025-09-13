import { resolve } from 'node:path';
import { ensureSlash } from '@hyperse/hps-srv-common';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';

/**
 * Normalizes the absolute paths of entry modules based on the provided evolve options and entry map.
 *
 * @param evolveOptions - The options for the evolve process.
 * @param evolveEntryMap - The map of evolve entries.
 * @returns An array of normalized entry module paths.
 */
export const normalizeEntryModuleAbsolutePath = (
  evolveOptions: HpsEvolveOptions,
  evolveEntryMap: EvolveEntryMap
): string[] => {
  const { projectCwd } = evolveOptions;
  const entryModulePaths: string[] = [];

  for (const [, entryMapContent] of Object.entries(evolveEntryMap)) {
    const { entryModuleBase, entry } = entryMapContent;
    if (entryModuleBase) {
      for (const entryModuleBaseItem of entryModuleBase) {
        const modulePath = ensureSlash(
          resolve(projectCwd, entryModuleBaseItem),
          true,
          true
        );
        entryModulePaths.push(modulePath);
      }
    } else {
      for (const entryItem of entry) {
        let entryItemPath = resolve(projectCwd, entryItem);
        if (
          /\.(ts|tsx|js|jsx)$/.test(entryItemPath) ||
          /(\\|\/)index$/.test(entryItemPath)
        ) {
          entryItemPath = entryItemPath.replace(/[/\\][^/\\]*$/, '');
        }
        const modulePath = ensureSlash(entryItemPath, true, true);
        entryModulePaths.push(modulePath);
      }
    }
  }

  return Array.from(new Set(entryModulePaths));
};
