import { dirname, join, relative, resolve } from 'node:path';
import { ensureSlash, normalizePlatformPath } from '@hyperse/hps-srv-common';
import type { EntryMapItem } from '../../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../../types/types-options.js';
import { ICON_PATH_REGEX } from './constants.js';

/**
 * Causeof we expose a component <Icon /> from `@wove/react` it can be optimized via icon-loader.
 * limitation assets match `svg-icons/**\/*.svg` to icon loader resolver.
 * @param resource
 * @returns
 */
export const isIconSvg = (resource: string) => {
  return ICON_PATH_REGEX.test(resource) && resource.endsWith('.svg');
};

/**
 * Get the asset filename based on the entry configuration.
 * This function determines the output path for assets by matching them against entry points.
 *
 * @param filename - The original filename of the asset
 * @param entryMapItemList - List of entry configurations
 * @param evolveOptions - Configuration options containing project paths
 * @returns The formatted asset filename with content hash
 */
export const getEntryAssetFileName = (
  filename: string,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
) => {
  const { projectCwd, projectVirtualPath } = evolveOptions;

  let assetBase = dirname(
    join(projectVirtualPath, filename.replace(/^src/, ''))
  );

  const allEntries: {
    entryName: string;
    entry: string;
  }[] = [];

  for (const [entryName, entryMapContent] of entryMapItemList) {
    for (const entryItem of entryMapContent.entry) {
      allEntries.push({
        entryName,
        entry: entryItem,
      });
    }
  }

  allEntries.sort((a, b) => b.entry.length - a.entry.length);

  for (const entryItem of allEntries) {
    const { entryName, entry } = entryItem;

    const entryDir = dirname(join(projectCwd, entry));

    const assetAbsName = resolve(projectCwd, filename);

    const matchedEntryDir = assetAbsName.startsWith(
      ensureSlash(entryDir, true, true)
    );

    if (matchedEntryDir) {
      assetBase = dirname(join(entryName, relative(entryDir, assetAbsName)));
      break;
    }
  }
  return `${normalizePlatformPath(assetBase)}/[name]-[contenthash:8][ext]`;
};
