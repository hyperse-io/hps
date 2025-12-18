import { relative } from 'node:path';
import { chalk, logger, mergeOptions, urlJoin } from '@hyperse/hps-srv-common';
import { type Compiler, rspack } from '@rspack/core';
import { assertSingleCompiler } from '../helpers/helper-assert-single-compiler.js';
import { flatEntryMap } from '../helpers/helper-flat-entry-map.js';
import { shouldEnableReactFastRefresh } from '../helpers/helper-should-enable-react-fast-refresh.js';
import type { EvolveDevServerEntryMap } from '../types/types-dev-server.js';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
import { createDevServerCompiler } from './create-dev-server-compiler.js';
import { loadRspackConfig } from './load-rspack-config.js';

export const startRspackServe = async (
  publicIp: string,
  servedDevServerEntries: EvolveDevServerEntryMap,
  servedDevServerEntryList: Array<EvolveDevServerEntryMap>,
  evolveOptions: HpsEvolveOptions
): Promise<boolean> => {
  const { projectCwd } = evolveOptions;
  // First entry option in a group
  const [firstDevServeEntryName, firstDevServeEntryOption] = Object.entries(
    servedDevServerEntries
  )[0];

  const { devServerPort, devServerHostUri } = firstDevServeEntryOption;

  for (const [, servedDevServerEntry] of Object.entries(
    servedDevServerEntries
  )) {
    const itemEntryConfig = servedDevServerEntry.entryConfig;
    const moduleFederation = itemEntryConfig.options?.moduleFederation;
    const moduleFederationRemotes = moduleFederation?.remotes || [];

    const allServedDevServerEntries = flatEntryMap(servedDevServerEntryList);
    moduleFederationRemotes.forEach((remote) => {
      // Dynamic construct remote endpoint as hostUri
      remote.endpoint = (shortName) => {
        const servedDevServerEntry = allServedDevServerEntries[shortName];
        if (!servedDevServerEntry) {
          throw new Error(`No servedDevServerEntry found via "${shortName}"`);
        }
        return urlJoin(servedDevServerEntry?.devServerHostUri, ['/public']);
      };
    });
  }

  const devEvolveEntryMap: EvolveEntryMap = Object.keys(
    servedDevServerEntries
  ).reduce<EvolveEntryMap>((previousValue, currentValue) => {
    previousValue[currentValue] =
      servedDevServerEntries[currentValue].entryConfig;
    return previousValue;
  }, {});

  // e.g. `http://dev.hps.com:3002/public/`
  const servePublicPath = urlJoin(devServerHostUri, ['public']);

  const rspackConfig = await loadRspackConfig(
    true,
    devEvolveEntryMap,
    mergeOptions(evolveOptions, {
      rspack: {
        publicPath: servePublicPath,
      },
    })
  );

  const enabledHmr = shouldEnableReactFastRefresh(
    true,
    [firstDevServeEntryName, firstDevServeEntryOption.entryConfig],
    evolveOptions
  );

  const config = assertSingleCompiler(
    devEvolveEntryMap,
    rspackConfig,
    evolveOptions
  );
  const compiler: Compiler = rspack(config);

  // '@rspack/plugin-react-refresh/client/reactRefreshEntry.js',
  const serveTask = createDevServerCompiler(
    compiler,
    enabledHmr,
    devServerPort,
    publicIp,
    evolveOptions
  );

  compiler.hooks.invalid.tap('fileChange', (fileName) => {
    const relativeFileName = relative(projectCwd, fileName || '');
    logger.info(`file change ➩ ${chalk(['cyan'])(relativeFileName || '')}`);
  });

  return serveTask;
};
