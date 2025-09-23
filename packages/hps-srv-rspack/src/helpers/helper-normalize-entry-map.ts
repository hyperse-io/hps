import _ from 'lodash';
import { posix } from 'node:path';
import {
  type EvolveEntryMap,
  type EvolveEntryMapContent,
} from '../types/types-entry-map.js';

/**
 * Make sure that we have correct `virtualPath` for each webpack `entry`
 * @param entryName the entryName defined via `hps-evolve.config.ts`.
 * @param evolveOptions
 * @returns
 */
export const normalizeEvolveEntryName = (
  entryName: string,
  projectVirtualPath: string
) => {
  const servedEntryName = entryName.replace(/^\//, '');
  const virtualPath = projectVirtualPath.replace(/^\//, '');
  const withVirtualPath = servedEntryName.startsWith(virtualPath);
  // Make sure that we have correct `virtualPath` for each webpack `entry`
  const finalEntryName = withVirtualPath
    ? servedEntryName
    : posix.join(virtualPath, servedEntryName);
  return finalEntryName.replace(/\/$/, '');
};

/**
 * Normalize hps.evolve entry map definition data.
 * Merge default entry item configuration values.
 * @param activedEntryMap actived entries
 * @param definedEntryMap defined entries in hps.evolve.js
 * @param projectVirtualPath virtual path for current `project`
 */
export const normalizeEvolveEntryMap = (
  activedEntryMap: EvolveEntryMap = {},
  definedEntryMap: EvolveEntryMap = {}
): EvolveEntryMap => {
  const newActivedEntries: EvolveEntryMap = {};
  for (const [entryKey, itemConfig] of Object.entries(definedEntryMap)) {
    // Setup default entry options.
    const defaultEntryItemConfig: Partial<EvolveEntryMapContent> = {
      options: {},
    };

    if (activedEntryMap[entryKey]) {
      newActivedEntries[entryKey] = _.merge(
        {},
        defaultEntryItemConfig,
        itemConfig,
        activedEntryMap[entryKey]
      );
    }
  }
  return newActivedEntries;
};
