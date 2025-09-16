import type { EvolveDevServerEntryMap } from '../types/types-dev-server.js';

/**
 * Flattens an array of `EvolveDevServerEntryMap` objects into a single `EvolveDevServerEntryMap`.
 *
 * @param servedDevServerEntryList - The array of `EvolveDevServerEntryMap` objects to flatten.
 * @returns The flattened `EvolveDevServerEntryMap`.
 */
export const flatEntryMap = (
  servedDevServerEntryList: Array<EvolveDevServerEntryMap>
): EvolveDevServerEntryMap => {
  return servedDevServerEntryList.reduce(
    (flatMap, servedDevServerEntryMapItem) => {
      return Object.assign(flatMap, servedDevServerEntryMapItem);
    },
    {}
  );
};
