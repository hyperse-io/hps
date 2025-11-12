import { chalk } from '@hyperse/hps-srv-common';
import { type EntryMapItem } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const shouldEnableReactFastRefresh = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions
) => {
  const entryItemOption = entryMapItem[1];
  // Check if the entry item has module federation
  const hasModuleFederation = !!entryItemOption.options?.moduleFederation;
  // Check if the entry item is a library, The library module can not run in the browser individually.
  const isEntryItemLibrary = !!entryItemOption.options?.output?.library;
  // Inject `react-refresh` if we are using preset `react`
  return (
    serveMode &&
    !hasModuleFederation &&
    !isEntryItemLibrary &&
    // No specificed `liveReload` config
    evolveOptions.devServer?.liveReload !== true
  );
};

export const getDisabledReasonWithHMR = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions
) => {
  const entryItemOption = entryMapItem[1];
  // Check if the entry item has module federation
  const hasModuleFederation = !!entryItemOption.options?.moduleFederation;
  // Check if the entry item is a library, The library module can not run in the browser individually.
  const isEntryItemLibrary = !!entryItemOption.options?.output?.library;
  // Inject `react-refresh` if we are using preset `react`
  let reason: string = '';

  if (!serveMode) {
    reason = 'The build is not in serve mode.';
  } else if (evolveOptions.devServer?.liveReload) {
    reason = 'liveReload is explicitly enabled in devServer options.';
  } else if (hasModuleFederation) {
    reason = 'Module Federation is enabled for this entry.';
  } else if (isEntryItemLibrary) {
    reason = 'This entry is configured as a library.';
  } else {
    reason = 'Unknown reasons.';
  }
  return ['HMR is disabled because:', chalk(['magenta'])(reason)].join(' ');
};
