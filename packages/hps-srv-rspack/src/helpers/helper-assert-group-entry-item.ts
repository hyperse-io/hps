import {
  type EntryMapItem,
  type EvolveEntryMap,
} from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { normalizeEvolveEntryName } from './helper-normalize-entry-map.js';

/**
 * Only fetch group entry map once `serve`,`build` recycle.
 * @returns
 */
export const assertGroupEntryItem = (
  entryMap: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
): EntryMapItem[] => {
  const result: EntryMapItem[] = [];
  for (const [entryChunkName, entryItem] of Object.entries(entryMap)) {
    result.push([entryChunkName, entryItem]);
  }
  if (!result.length) {
    throw new Error(`No entry map found while "serve", "build" process!`);
  }

  return result.map(([entryName, entryConfig]) => {
    // Make sure that we have correct `virtualPath` for each webpack `entry`
    const normalizedEntryName = normalizeEvolveEntryName(
      entryName,
      evolveOptions.projectVirtualPath
    );
    return [normalizedEntryName, entryConfig];
  });
};
