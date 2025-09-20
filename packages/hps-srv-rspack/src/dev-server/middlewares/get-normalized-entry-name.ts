import { normalizeEvolveEntryName } from '../../helpers/helper-normalize-entry-map.js';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type HpsEvolveDevServerOptions } from '../../types/types-dev-server.js';

export function getNormalizedEntryName(
  entryName: string,
  projectVirtualPath: string,
  servedDevServerEntries: EvolveDevServerEntryMap,
  devServer?: HpsEvolveDevServerOptions
) {
  let normalizedEntryName = normalizeEvolveEntryName(
    entryName,
    projectVirtualPath
  );

  // Check if we have customized dir resolver
  if (devServer?.bundleDirResolver) {
    const isServedEntry = Object.keys(servedDevServerEntries).includes(
      entryName
    );
    normalizedEntryName = devServer?.bundleDirResolver(normalizedEntryName, {
      currEntry: entryName,
      projectVirtualPath,
      isServedModule: isServedEntry,
    });
  }
  return normalizedEntryName;
}
