import { isDeepEqual } from '../../../hps-srv-common/src/index.js';
import { ignoreEntryOptionKeys } from '../constants.js';
import {
  type EvolveEntryItemOption,
  type EvolveEntryMap,
} from '../types/types-entry-map.js';
import { normalizeCheckEntryOptions } from './helper-normalize-check-entry-options.js';

/**
 * Verifies if the options of all entries in a group are equal, excluding specified keys.
 *
 * @param groupEvolveEntryMap - The map of group entries.
 * @param ignoreOptionKeys - The keys to be ignored when comparing options.
 * @returns A boolean indicating if the options of all entries are equal.
 */
export const verifyGroupEntryOptions = (
  groupEvolveEntryMap: EvolveEntryMap,
  ignoreOptionKeys: Array<keyof EvolveEntryItemOption> = ignoreEntryOptionKeys,
  serveMode: boolean
): boolean => {
  const groupEvolveEntryMapValues = Object.values(groupEvolveEntryMap);
  if (groupEvolveEntryMapValues.length === 1) {
    return true;
  }
  const firstEntryMap = groupEvolveEntryMapValues.shift();
  const firstEntryOptions = normalizeCheckEntryOptions(
    serveMode,
    firstEntryMap?.options,
    ignoreOptionKeys
  );

  return groupEvolveEntryMapValues.every((entryOption) => {
    return isDeepEqual(
      firstEntryOptions,
      normalizeCheckEntryOptions(
        serveMode,
        entryOption.options,
        ignoreOptionKeys
      )
    );
  });
};
