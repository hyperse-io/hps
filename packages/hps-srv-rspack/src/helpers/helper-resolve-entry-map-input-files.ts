import { fileWalk } from '@armit/file-utility';
import { arrayUnique } from '@hyperse/hps-srv-common';
import { type EvolveEntryMap } from '../types/types-entry-map.js';

/**
 * Transform all entry files via `entryMap`
 * @param projectCwd The project root directory
 * @param entryMap The evolve entryMap definition
 * @returns The absolute entry input files.
 */
export const resolveEntryMapInputFiles = async (
  projectCwd: string,
  entryMap: EvolveEntryMap
): Promise<string[]> => {
  const pattern: string[] = [];
  for (const [, config] of Object.entries(entryMap)) {
    const entries = config.entry.map(
      (s) => s.replace(/.(?:js|jsx|tsx|ts)$/, '') + '.*'
    );
    pattern.push(...entries);
  }
  const walkPattern = arrayUnique(pattern);
  return await fileWalk(walkPattern, {
    cwd: projectCwd,
    absolute: true,
  });
};
