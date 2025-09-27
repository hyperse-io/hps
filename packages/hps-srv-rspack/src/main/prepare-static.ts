import { chalk, logger, urlJoin } from '@hyperse/hps-srv-common';
import { attachMockMiddlewares } from '@hyperse/hps-srv-mock';
import { createAppPageRoute } from '../dev-server/create-app-page-route.js';
import { createDevServer } from '../dev-server/create-dev-server.js';
import { normalizePageProxy } from '../helpers/helper-normalize-page-proxy.js';
import { openPage } from '../helpers/helper-open-page.js';
import { type HpsEvolveOptions } from '../types/index.js';

/**
 * The main entry to start evolve serve
 * @param projectCwd The Root directory (workspace) of this project.
 * @param evolveOptions FlatEvolveOptions
 */
export const prepareStatic = async (
  projectCwd: string,
  evolveOptions: HpsEvolveOptions
) => {
  // Create pure dev server.
  const { app, devHostUri, devPort } = await createDevServer(evolveOptions);

  // Attach core handlers for mock
  await attachMockMiddlewares(
    app,
    {
      ...evolveOptions.devServer?.mockOptions,
      projectCwd,
    },
    {
      hostUri: devHostUri,
      port: devPort,
    }
  );

  // Create new route `/pages*`,`*` to pure dev server
  createAppPageRoute(projectCwd, app, devHostUri, {}, evolveOptions);

  const pageProxy = normalizePageProxy(
    evolveOptions.devServer?.pageProxy || '/pages'
  );

  const mainPage = urlJoin(devHostUri, [pageProxy]);

  // Open page via browser
  if (evolveOptions.devServer?.autoOpen) {
    openPage(mainPage);
  }

  logger.info(
    `${'static page'.padEnd(12, ' ')} ➩ ${chalk(['cyan'])(mainPage)}`
  );
};
