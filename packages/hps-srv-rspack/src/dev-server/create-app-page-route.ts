import { type Application } from 'express';
import { type TrustedEditor } from '@hyperse/inspector-common';
import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';
import { normalizePageProxy } from '../helpers/helper-normalize-page-proxy.js';
import type { EvolveDevServerEntryMap } from '../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../types/types-options.js';
import {
  createPageMiddleware,
  createPublicAssetsMiddleware,
} from './middlewares/index.js';

/**
 * Add route `/pages`, `*` to main web-server
 */
export const createAppPageRoute = (
  projectCwd: string,
  app: Application,
  devHostUri: string,
  servedDevServerEntries: EvolveDevServerEntryMap,
  evolveOptions: HpsEvolveOptions
) => {
  const { devServer, inspector } = evolveOptions;
  const pageProxy = normalizePageProxy(devServer?.pageProxy || '/pages');

  // Attach inspector middleware
  if (inspector) {
    devServer?.middlewares?.push(
      createLaunchEditorMiddleware({
        customLaunchEditorEndpoint: inspector.customLaunchEditorEndpoint,
        trustedEditor: inspector.trustedEditor as TrustedEditor,
        projectCwd,
      })
    );
  }

  // Attach request handlers for context `/page/*`
  app.use(
    pageProxy,
    ...createPageMiddleware(
      devHostUri,
      devServer?.apiContext || 'api',
      servedDevServerEntries,
      evolveOptions
    )
  );

  // handle all no-matched page request.
  app.use('*splat', createPublicAssetsMiddleware(projectCwd, pageProxy));
};
