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
    evolveOptions.loaderOptions.babelOptions?.usePreset === 'react' &&
    !hasModuleFederation &&
    !isEntryItemLibrary &&
    // No specificed `liveReload` config
    evolveOptions.devServer?.liveReload !== true
  );
};
