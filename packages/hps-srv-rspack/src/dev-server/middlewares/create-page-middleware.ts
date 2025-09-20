import { type Request, type RequestHandler, type Response } from 'express';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { getPageMainHtml } from './get-page-main-html.js';
import { getPageModuleHtml } from './get-page-module-html.js';
import { getRuntimeManifest } from './get-runtime-manifest.js';

/**
 * A middleware to proxy the page modules template.
 * @example `http://dev.hps.com:3001/pages`
 * @param mode The mode of this dev server instance.
 * @param hostUri The main host base url.
 * @param apiContext apiBase e.g. `api`
 * @param servedDevServerEntries The served webpack entries
 * @param forPageMiddlewares Allow us provider customized middlewares for `page`, `modules`
 * @param evolveOptions The evolve config options
 */
export const createPageMiddleware = (
  devHostUri: string,
  apiContext: string,
  servedDevServerEntries: EvolveDevServerEntryMap,
  evolveOptions: HpsEvolveOptions
): RequestHandler[] => {
  const handler = async (req: Request, res: Response) => {
    let html;
    // Expose a special runtime manifest.json for other system to intergration
    if (req.path === '/runtime/manifest.json') {
      const jsonManifest = await getRuntimeManifest(
        servedDevServerEntries,
        devHostUri,
        evolveOptions
      );
      res.json(jsonManifest);
      return;
    }
    // For root main page
    if (req.path === '/') {
      html = await getPageMainHtml(
        servedDevServerEntries,
        devHostUri,
        evolveOptions
      );
    } else {
      // For serve page modules
      html = await getPageModuleHtml(
        servedDevServerEntries,
        req,
        devHostUri,
        apiContext,
        evolveOptions
      );
    }
    res.send(html);
  };
  return (evolveOptions.devServer?.middlewares || []).concat(handler);
};
