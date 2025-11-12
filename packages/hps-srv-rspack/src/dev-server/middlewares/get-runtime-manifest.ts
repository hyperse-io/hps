import type {
  EvolveDevServerEntryMap,
  EvolveDevServerManifest,
} from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { getSortedModules } from './get-all-sorted-modules.js';
import { getBundleAsset } from './get-bundle-asset.js';

export const getRuntimeManifest = async (
  servedDevServerEntries: EvolveDevServerEntryMap,
  devHostUri: string,
  evolveOptions: HpsEvolveOptions
): Promise<EvolveDevServerManifest> => {
  const sortedModules = getSortedModules(
    evolveOptions,
    servedDevServerEntries,
    devHostUri
  );

  const runtimeManifest: EvolveDevServerManifest = {};
  for (const moduleItem of sortedModules) {
    const { entryName, isServedEntry, devServerHostUri, normalizedEntryName } =
      moduleItem;

    const bundleScripts = [
      getBundleAsset(devServerHostUri, normalizedEntryName, '.js'),
    ];
    const bundleStyles = [
      getBundleAsset(devServerHostUri, normalizedEntryName, '.css'),
    ];
    runtimeManifest[normalizedEntryName] = {
      entryName,
      styles: bundleStyles,
      scripts: bundleScripts,
      isServed: isServedEntry,
      runtimeChunks: [],
    };
  }
  return runtimeManifest;
};
