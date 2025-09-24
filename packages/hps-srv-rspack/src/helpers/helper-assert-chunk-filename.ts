import { join } from 'path';
import type { EntryMapItem } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { enableBundleHashName } from './helper-enable-bundle-hashname.js';

/**
 * Assert the chunk filename based on the entry item and the extension.
 * If we have customized `chunkFileVirtualPath`, we will join the `chunkFileVirtualPath` and the `chunkFilename`.
 *
 * @param evolveOptions - The evolve options.
 * @param entryItem - The entry item.
 * @param extension - The extension.
 * @returns The chunk filename.
 */
export const assertChunkFilename = (
  evolveOptions: HpsEvolveOptions,
  entryItem: EntryMapItem,
  extension: string = 'js'
) => {
  const { rspack } = evolveOptions;
  const entryItemOption = entryItem[1];

  const bundleHashNameEnabled = enableBundleHashName(
    evolveOptions,
    entryItemOption?.options
  );
  let chunkFilename = bundleHashNameEnabled
    ? `[id].[contenthash].${extension}`
    : `[id].${extension}`;

  if (rspack.output?.chunkFileVirtualPath) {
    chunkFilename = join(rspack.output.chunkFileVirtualPath, chunkFilename);
  }

  return chunkFilename;
};
