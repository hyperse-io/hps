import { mergeOptions } from '@hyperse/hps-srv-common';
import type { RspackOptions } from '@rspack/core';
import { type EntryMapItem } from '../types/types-entry-map.js';
import { type HpsEvolveRspackOptions } from '../types/types-rspack.js';

export const createExternals = (
  externals: HpsEvolveRspackOptions['externals'] = {},
  entryItem?: EntryMapItem
): RspackOptions['externals'] => {
  let lastExternals = externals;
  if (typeof externals === 'function') {
    lastExternals = externals();
  }
  const entryItemContent = entryItem?.[1];
  const entryItemExternals = entryItemContent?.options?.externals || {};
  return mergeOptions(lastExternals, entryItemExternals);
};
