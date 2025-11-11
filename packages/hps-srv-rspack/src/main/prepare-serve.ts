import { arrayUnique, chalk, logger, urlJoin } from '@hyperse/hps-srv-common';
import { attachMockMiddlewares } from '@hyperse/hps-srv-mock';
import { ignoreEntryOptionKeys } from '../constants.js';
import { startRspackServe } from '../core/start-rspack-serve.js';
import { createAppPageRoute } from '../dev-server/create-app-page-route.js';
import { createDevServer } from '../dev-server/create-dev-server.js';
import { createDevServerEntries } from '../dev-server/create-dev-server-entries.js';
import { getRuntimeManifest } from '../dev-server/middlewares/get-runtime-manifest.js';
import { flatEntryMap } from '../helpers/helper-flat-entry-map.js';
import { normalizePageProxy } from '../helpers/helper-normalize-page-proxy.js';
import { openPage } from '../helpers/helper-open-page.js';
import { bindCLIShortcuts } from '../helpers/helper-shortcuts.js';
import { splitToEntryGroup } from '../helpers/helper-split-to-entry-group.js';
import { verifyGroupEntryOptions } from '../helpers/helper-verify-group-entry-options.js';
import type {
  EvolveDevServerEntryMap,
  EvolveDevServerManifest,
} from '../types/types-dev-server.js';
import { type EvolveEntryMap } from '../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../types/types-options.js';

/**
 * The main entry to start evolve serve
 * @param projectCwd The Root directory (workspace) of this project.
 * @param servedEntries All normalized webpack entries we have served.
 * @param evolveOptions FlatEvolveOptions
 */
export const prepareServe = async (
  projectCwd: string,
  servedEntries: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions
): Promise<EvolveDevServerManifest | undefined> => {
  // Group by entry group name
  const entryMapGroupList = splitToEntryGroup(
    servedEntries,
    evolveOptions,
    ignoreEntryOptionKeys,
    true
  );

  if (!entryMapGroupList.length) {
    logger.warn(`No served entries provided!`);
    return;
  }

  const serveTasks: Promise<boolean>[] = [];
  // Create pure dev server.
  const { app, devPort, devHostUri, publicIp } =
    await createDevServer(evolveOptions);

  // Extract all the mock filters of served entries.
  const mockFilters = evolveOptions.devServer?.mockOptions?.mockFilters || [];

  // Loop all entries gather all mock files definition from each entry item.
  for (const [, value] of Object.entries(servedEntries)) {
    mockFilters.push(...(value.options?.mockFilters || []));
  }

  // Attach core handlers for mock
  await attachMockMiddlewares(
    app,
    {
      ...evolveOptions.devServer?.mockOptions,
      mockFilters: arrayUnique(mockFilters),
      projectCwd,
    },
    {
      hostUri: devHostUri,
      port: devPort,
    }
  );

  let lastPort = devPort;
  const servedDevServerEntryList: Array<EvolveDevServerEntryMap> = [];

  for (const entryMapGroup of entryMapGroupList) {
    // Verify that each entry option is the same in a group
    if (!verifyGroupEntryOptions(entryMapGroup, ignoreEntryOptionKeys, true)) {
      throw new Error('The entry options in a group must be the same.');
    }
    // Create dev-server configuration for all servedEntries.
    lastPort++;
    const servedDevServerEntries = await createDevServerEntries(
      lastPort,
      entryMapGroup,
      evolveOptions
    );
    servedDevServerEntryList.push(servedDevServerEntries);
  }

  // Create new route `/pages*`,`*` to pure dev server
  const flatServedDevServerEntries = flatEntryMap(servedDevServerEntryList);
  createAppPageRoute(
    projectCwd,
    app,
    devHostUri,
    flatServedDevServerEntries,
    evolveOptions
  );

  const pageProxy = normalizePageProxy(
    evolveOptions.devServer?.pageProxy || '/pages'
  );

  const mainPage = urlJoin(devHostUri, [pageProxy]);

  // Open page via browser
  if (evolveOptions.devServer?.autoOpen) {
    openPage(mainPage);
  }

  for (const servedDevServerEntryItem of servedDevServerEntryList) {
    // Create dev-server compiler tasks
    const task = startRspackServe(
      publicIp,
      servedDevServerEntryItem,
      servedDevServerEntryList,
      evolveOptions
    );
    serveTasks.push(task);
  }

  const devServerManifest = await getRuntimeManifest(
    flatServedDevServerEntries,
    devHostUri,
    evolveOptions
  );

  return Promise.all(serveTasks).then(() => {
    logger.info(`debug page ➩ ${chalk(['cyan'])(mainPage)}`);
    bindCLIShortcuts({ mainPage });
    return devServerManifest;
  });
};
