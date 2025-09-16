import { posix } from 'node:path';
import { devReactFastRefresh } from '../../constants.js';
import { shouldEnableReactFastRefresh } from '../../helpers/helper-should-enable-react-fast-refresh.js';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type EvolveEntryMapContent } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { getBundleAsset } from './get-bundle-asset.js';

export function getHmrRuntimeChunks(
  servedDevServerEntries: EvolveDevServerEntryMap,
  entryName: string,
  normalizedCurrEntry: string,
  currEntryItem: EvolveEntryMapContent,
  evolveOptions: HpsEvolveOptions,
  devServerHostUri: string
) {
  const enabledHmr =
    servedDevServerEntries[entryName] &&
    shouldEnableReactFastRefresh(
      true,
      [normalizedCurrEntry, currEntryItem],
      evolveOptions
    );

  if (enabledHmr) {
    const runtimeAsset = getBundleAsset(
      devServerHostUri,
      posix.join(normalizedCurrEntry, devReactFastRefresh.runtime),
      '.js'
    );
    const reactRefreshSetup = getBundleAsset(
      devServerHostUri,
      posix.join(normalizedCurrEntry, devReactFastRefresh.reactRefreshSetup),
      '.js'
    );
    return [runtimeAsset, reactRefreshSetup];
  }
  return [];
}
