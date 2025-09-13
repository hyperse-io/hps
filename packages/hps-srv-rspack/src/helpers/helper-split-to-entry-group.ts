import _ from 'lodash';
import { isDeepEqual } from '@hyperse/hps-srv-common';
import { ignoreEntryOptionKeys } from '../constants.js';
import {
  type EvolveEntryItemOption,
  type EvolveEntryMap,
  type EvolveEntryMapContent,
} from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import { normalizeCheckEntryOptions } from './helper-normalize-check-entry-options.js';
import { normalizeGroupName } from './helper-normalize-group-name.js';
/**
 * Groups the manual entries based on their group names.
 * @param manualEntries - The map of manual entries.
 * @returns An array of grouped manual entries.
 */
export const manualGrouping = (
  manualEntries: (EvolveEntryMapContent & { entryName: string })[]
): Array<EvolveEntryMap> => {
  const manualGroupEntryMap = _.groupBy(manualEntries, (entry) => {
    return entry['groupName'];
  });

  const evolveEntryMapList: Array<EvolveEntryMap> = [];

  for (const [, groupItem] of Object.entries(manualGroupEntryMap)) {
    const evolveEntryMapItem = groupItem.reduce(
      (
        prev: EvolveEntryMap,
        curr: EvolveEntryMapContent & { entryName: string }
      ) => {
        prev[curr.entryName] = _.omitBy(
          curr,
          'entryName'
        ) as EvolveEntryMapContent & { entryName: string };
        return prev;
      },
      {}
    );
    evolveEntryMapList.push(evolveEntryMapItem);
  }

  return evolveEntryMapList;
};

/**
 * Reduces an array of autoEntries into groups based on their options.
 * Each group is represented by a groupKey and contains an EvolveEntryMap.
 *
 * @param evolveOptions - The FlatEvolveOptions object.
 * @param autoEntries - An array of EvolveEntryMapContent objects with an additional entryName property.
 * @param ignoreOptionKeys - An array of keys to ignore when comparing entry options.
 * @param serveMode - A boolean indicating whether the function is running in serve mode.
 * @returns An object where each key represents a groupKey and its value is an EvolveEntryMap.
 */
export const autoGroupingReduce = (
  autoEntries: (EvolveEntryMapContent & { entryName: string })[],
  ignoreOptionKeys: Array<keyof EvolveEntryItemOption> = [],
  serveMode: boolean
): Record<string, EvolveEntryMap> => {
  return _.reduce<
    EvolveEntryMapContent & { entryName: string },
    Record<string, EvolveEntryMap>
  >(
    autoEntries,
    (prev, curr, index) => {
      let lastGroupingKey = `auto_grouping_reduce-${index}`;

      const currEntryOptions = normalizeCheckEntryOptions(
        serveMode,
        curr.options,
        ignoreOptionKeys
      );

      for (const [groupingKey, groupEntryMap] of Object.entries(prev)) {
        const firsEntryMap = Object.values(groupEntryMap)[0];
        const firstEntryOptions = normalizeCheckEntryOptions(
          serveMode,
          firsEntryMap.options,
          ignoreOptionKeys
        );
        if (isDeepEqual(currEntryOptions, firstEntryOptions)) {
          lastGroupingKey = groupingKey;
          break;
        }
      }

      prev[lastGroupingKey] = _.merge(prev[lastGroupingKey], {
        [curr.entryName]: _.omitBy(curr, 'entryName'),
      });
      return prev;
    },
    {}
  );
};

/**
 * Assigns a group name to each entry in the evolveEntryMapList based on the projectVirtualPath.
 *
 * @param evolveOptions - The options for the evolve process.
 * @param evolveEntryMapList - The list of evolve entry maps.
 * @returns The updated list of evolve entry maps with group names assigned.
 */
export const autoAssignGroupName = (
  evolveOptions: HpsEvolveOptions,
  evolveEntryMapList: Array<EvolveEntryMap>,
  originalGroupCount: number = 0
): Array<EvolveEntryMap> => {
  const { projectVirtualPath } = evolveOptions;
  const evolveEntryMapItemList: Array<EvolveEntryMap> = [];

  let index = originalGroupCount;
  for (const evolveEntryMap of evolveEntryMapList) {
    const evolveEntryMapItem: EvolveEntryMap = {};
    const groupName = normalizeGroupName(projectVirtualPath, index++);
    for (const [entryName, entryContent] of Object.entries(evolveEntryMap)) {
      entryContent.groupName = groupName;
      evolveEntryMapItem[entryName] = entryContent as EvolveEntryMapContent;
    }
    evolveEntryMapItemList.push(evolveEntryMapItem);
  }

  return evolveEntryMapItemList;
};

/**
 * Groups the given autoEntries into multiple EvolveEntryMap based on their options.
 * If the group size exceeds the maximum group size, it will be sliced into smaller groups.
 *
 * @param evolveOptions - The FlatEvolveOptions object.
 * @param autoEntries - An array of EvolveEntryMapContent objects with an additional entryName property.
 * @param ignoreOptionKeys - An array of keys to ignore in the EvolveEntryItemOption object.
 * @param serveMode - A boolean indicating whether the serve mode is enabled.
 * @param originalGroupCount - The original group count.
 * @returns An array of EvolveEntryMap representing the grouped entries.
 */
export const autoGrouping = (
  evolveOptions: HpsEvolveOptions,
  autoEntries: (EvolveEntryMapContent & { entryName: string })[],
  ignoreOptionKeys: Array<keyof EvolveEntryItemOption> = [],
  serveMode: boolean,
  originalGroupCount: number = 0
): Array<EvolveEntryMap> => {
  const { maxEntryGroupSize = 10 } = evolveOptions;

  const autoGroupingReduceMap = autoGroupingReduce(
    autoEntries,
    ignoreOptionKeys,
    serveMode
  );

  const autoGroupEntryMapList: Array<EvolveEntryMap> = [];
  // slice each group
  for (const [, groupItem] of Object.entries(autoGroupingReduceMap)) {
    const groupKeys = Object.keys(groupItem);
    if (groupKeys.length > maxEntryGroupSize) {
      for (let i = 0; i < groupKeys.length; i += maxEntryGroupSize) {
        const sliceGroupKeys = groupKeys.slice(i, i + maxEntryGroupSize);
        const sliceEvolveEntryMap = sliceGroupKeys.reduce<EvolveEntryMap>(
          (prev, curr) => {
            prev[curr] = groupItem[curr];
            return prev;
          },
          {}
        );
        autoGroupEntryMapList.push(sliceEvolveEntryMap);
      }
    } else {
      autoGroupEntryMapList.push(groupItem);
    }
  }

  return autoAssignGroupName(
    evolveOptions,
    autoGroupEntryMapList,
    originalGroupCount
  );
};

/**
 * Splits the served entries into groups based on the given options.
 *
 * @param evolveEntries - The map of served entries.
 * @param evolveOptions - The FlatEvolveOptions object.
 * @param ignoreOptionKeys - The list of option keys to ignore.
 * @param serveMode - A boolean indicating whether the serve mode is enabled.
 * @param originalGroupCount - The original group count.
 * @returns An array of evolve entry maps representing the groups.
 */
export const splitToEntryGroup = (
  evolveEntries: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions,
  ignoreOptionKeys: Array<keyof EvolveEntryItemOption> = ignoreEntryOptionKeys,
  serveMode: boolean,
  originalGroupCount: number = 0
): Array<EvolveEntryMap> => {
  const { isolation = false } = evolveOptions;
  if (isolation) {
    const evolveEntryMapList: Array<EvolveEntryMap> = [];
    for (const [entryName, entryContent] of Object.entries(evolveEntries)) {
      entryContent.groupName = entryName;
      evolveEntryMapList.push({
        [entryName]: entryContent,
      });
    }
    return evolveEntryMapList;
  }

  const evolveEntryFlatList = _.flatMap<
    EvolveEntryMap,
    EvolveEntryMapContent & {
      entryName: string;
    }
  >(evolveEntries, (entryOption, entryName) => {
    return {
      ...entryOption,
      entryName,
    };
  });

  const evolveEntryGroupMap = _.groupBy(evolveEntryFlatList, (entry) => {
    return entry.groupingSource;
  });

  const manualEvolveEntryMapList = manualGrouping(
    evolveEntryGroupMap['manual']
  );

  const autoEvolveEntryMapList = autoGrouping(
    evolveOptions,
    evolveEntryGroupMap['auto'],
    ignoreOptionKeys,
    serveMode,
    originalGroupCount
  );

  return [...manualEvolveEntryMapList, ...autoEvolveEntryMapList];
};
