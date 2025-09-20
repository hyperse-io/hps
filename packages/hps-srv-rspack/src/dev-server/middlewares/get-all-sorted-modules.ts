import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type EvolveEntryMapContent } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { getDevServerHostUri } from './get-dev-server-host-uri.js';
import { getNormalizedEntryName } from './get-normalized-entry-name.js';
import { getProjectVirtualPath } from './get-project-virtual-path.js';

export interface SortedModuleItem {
  /**
   * The entry name defined in `entryMap`
   */
  entryName: string;
  /**
   * The value indicates whether the entry is served by the dev server.
   */
  isServedEntry: boolean;
  /**
   * The normalized project virtual path.
   */
  projectVirtualPath: string;
  /**
   * THe entry content defined in `entryMap`
   */
  entryContent: EvolveEntryMapContent;

  /**
   * The main dev server host uri
   */
  devHostUri: string;
  /**
   * The normalized dev server host uri
   */
  devServerHostUri: string;
  /**
   * The normalized entry name.
   */
  normalizedEntryName: string;
}

export function getSortedModules(
  evolveOptions: HpsEvolveOptions,
  servedDevServerEntries: EvolveDevServerEntryMap,
  devHostUri: string
) {
  const sortedModules: SortedModuleItem[] = [];
  const projectVirtualPath = getProjectVirtualPath(evolveOptions);

  for (const [entryName, entryContent] of Object.entries(
    evolveOptions.entryMap
  )) {
    // `home`, servedDevServerEntries[key] => `home`
    const isServedEntry = Object.keys(servedDevServerEntries).includes(
      entryName
    );

    const devServerHostUri = getDevServerHostUri(
      servedDevServerEntries,
      entryName,
      devHostUri
    );

    // `hps/evolve/home`
    const normalizedEntryName = getNormalizedEntryName(
      entryName,
      projectVirtualPath,
      servedDevServerEntries,
      evolveOptions.devServer
    );

    sortedModules.push({
      entryName,
      entryContent,
      devHostUri,
      devServerHostUri,
      normalizedEntryName,
      projectVirtualPath,
      isServedEntry,
    });
  }
  return sortedModules;
}
