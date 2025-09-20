import { type EntryMapItem } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const allowPx2remForModule = (
  entryItem?: EntryMapItem,
  evolveOptions?: HpsEvolveOptions
) => {
  // Global settings for `AllowPx2Rem`
  const globalAllowPx2Rem = evolveOptions?.loaderOptions?.pixelOptions;
  const currItemPx2Rem =
    (entryItem && entryItem[1]?.options?.allowPx2rem) ?? globalAllowPx2Rem;

  return !!currItemPx2Rem;
};
