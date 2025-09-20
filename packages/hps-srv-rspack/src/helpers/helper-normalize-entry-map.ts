import _ from 'lodash';
import { posix } from 'node:path';
import {
  type EvolveEntryMap,
  type EvolveEntryMapContent,
} from '../types/types-entry-map.js';

/**
 * Normalizes the entry group options based on the provided entry map content.
 * If the entry map content has a group name, the grouping source will be set to 'manual'.
 * Otherwise, the grouping source will be set to 'auto'.
 *
 * @param entryMapContent - The entry map content to normalize.
 * @returns The normalized entry group options containing the group name and grouping source.
 */
const normalizeEntryGroupOptions = (
  entryMapContent: EvolveEntryMapContent
): Pick<EvolveEntryMapContent, 'groupName' | 'groupingSource'> => {
  if (entryMapContent && entryMapContent.groupName) {
    return {
      groupName: entryMapContent.groupName,
      groupingSource: 'manual',
    };
  }
  return {
    groupingSource: 'auto',
  };
};

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
      // Perfect entry group option
      const entryItemGroupConfig: Pick<
        EvolveEntryMapContent,
        'groupName' | 'groupingSource'
      > = normalizeEntryGroupOptions(itemConfig);

      newActivedEntries[entryKey] = _.merge(
        {},
        defaultEntryItemConfig,
        itemConfig,
        activedEntryMap[entryKey],
        entryItemGroupConfig
      );
    }
  }
  return newActivedEntries;
};
