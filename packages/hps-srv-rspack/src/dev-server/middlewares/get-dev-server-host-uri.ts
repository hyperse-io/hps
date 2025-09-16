import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';

export function getDevServerHostUri(
  servedDevServerEntries: EvolveDevServerEntryMap,
  currEntry: string,
  devHostUri: string
) {
  const currDevServerEntry = servedDevServerEntries[currEntry];
  // Maybe No currEntry found in servedDevServerEntries, use default `hostUri`, e.g. `static` mode.
  return currDevServerEntry?.devServerHostUri || devHostUri;
}
