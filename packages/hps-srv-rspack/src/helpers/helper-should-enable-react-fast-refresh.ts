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
  const reason = ['HMR is disabled because:'];

  if (!serveMode) {
    reason.push(chalk(['magenta'])('The build is not in serve mode.'));
  } else if (evolveOptions.devServer?.liveReload) {
    reason.push(
      chalk(['magenta'])(
        'liveReload is explicitly enabled in devServer options.'
      )
    );
  } else if (hasModuleFederation) {
    reason.push(
      chalk(['magenta'])('Module Federation is enabled for this entry.')
    );
  } else if (isEntryItemLibrary) {
    reason.push(chalk(['magenta'])('This entry is configured as a library.'));
  } else {
    reason.push(chalk(['magenta'])('of unknown reasons.'));
  }
  return reason.join(' ');
};
