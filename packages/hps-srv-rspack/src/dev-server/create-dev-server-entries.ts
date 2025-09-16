import { getAvailableDomain, mergeOptions } from '@hyperse/hps-srv-common';
import { normalizeEvolveEntryName } from '../helpers/helper-normalize-entry-map.js';
import type { EvolveDevServerEntryMap } from '../types/types-dev-server.js';
import { type EvolveEntryMap } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const createDevServerEntries = async (
  lastPort: number,
  servedEntries: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
) => {
  const { devServer, projectVirtualPath } = evolveOptions;
  const servedDevServerEntries: EvolveDevServerEntryMap = {};
  // https://github.com/webpack/webpack-dev-server/issues/2692
  // For `webpack-dev-server@4.0.0` we should run dev server on each compiler

  // Create individual devPort for each compiler here.
  const { port: devServerPort, hostUri: devServerHostUri } =
    await getAvailableDomain(
      mergeOptions(
        {
          port: devServer?.port,
          hostname: devServer?.hostname,
          isHttps: !!devServer?.https,
        },
        {
          port: lastPort,
        }
      )
    );
  // Prepare devServer ports for each served entry.
  for (const [entryName, entryConfig] of Object.entries(servedEntries)) {
    // entryName: `home` should be normalized to ${`projectVirtualPath`}/home
    const normalizedEntryName = normalizeEvolveEntryName(
      entryName,
      projectVirtualPath
    );
    servedDevServerEntries[entryName] = {
      entryConfig,
      devServerPort,
      devServerHostUri,
      normalizedEntryName,
    };
  }
  return servedDevServerEntries;
};
