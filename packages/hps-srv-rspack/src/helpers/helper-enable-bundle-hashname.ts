import { type EvolveEntryItemOption } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const enableBundleHashName = (
  evolveOptions: HpsEvolveOptions,
  entryItemOption?: EvolveEntryItemOption
) => {
  // Global settings for `enableBundleHashName`
  const globalEnabledStatus = evolveOptions.rspack?.enableBundleHashName;

  const bundleHashNameEnabled =
    entryItemOption?.enableBundleHashName ?? globalEnabledStatus;
  return !!bundleHashNameEnabled;
};
