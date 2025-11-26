import { urlJoin } from '@hyperse/hps-srv-common';
import { normalizePageProxy } from '../../helpers/helper-normalize-page-proxy.js';
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
  const pageProxy = normalizePageProxy(
    evolveOptions.devServer?.pageProxy || '/pages'
  );

  const runtimeManifest: EvolveDevServerManifest = {};
  for (const moduleItem of sortedModules) {
    const {
      entryName,
      entryContent,
      isServedEntry,
      devServerHostUri,
      normalizedEntryName,
      projectVirtualPath,
    } = moduleItem;

    const bundleScripts = [
      getBundleAsset(devServerHostUri, normalizedEntryName, '.js'),
    ];
    const bundleStyles = [
      getBundleAsset(devServerHostUri, normalizedEntryName, '.css'),
    ];

    const linkHref = urlJoin(devHostUri, [pageProxy, entryName]);

    // Allow customized page main link.
    const servePageMainLinkFn =
      entryContent.options?.servePageMainLinkFn || ((link: string) => link);

    const link = servePageMainLinkFn(linkHref, {
      hostUri: devHostUri,
      entryName,
      virtualPath: projectVirtualPath,
    });

    runtimeManifest[normalizedEntryName] = {
      entryName,
      link,
      styles: bundleStyles,
      scripts: bundleScripts,
      isServed: isServedEntry,
      runtimeChunks: [],
    };
  }
  return runtimeManifest;
};
