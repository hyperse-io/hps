import { type Request, type RequestHandler, type Response } from 'express';
import type {
  EvolveDevServerEntryMap,
  HpsEvolveDevServerOptions,
} from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { getPageMainHtml } from './get-page-main-html.js';
import { getPageModuleHtml } from './get-page-module-html.js';
import { getRuntimeManifest } from './get-runtime-manifest.js';
import { getStaticModuleHtml } from './get-static-module-html.js';

const matchStaticPath = (
  reqPath: string,
  staticPaths: HpsEvolveDevServerOptions['staticPages'] = []
): Required<HpsEvolveDevServerOptions>['staticPages'][number] | undefined => {
  return staticPaths.find((item) => {
    if (typeof item.routePath === 'function') {
      return item.routePath(reqPath);
    }
    return `/${reqPath}`
      .replace(/^\//, '')
      .startsWith(`/${item.routePath}`.replace(/^\//, ''));
  });
};

/**
 * A middleware to proxy the page modules template.
 * @example `http://dev.hps.com:3001/pages`
 * @param mode The mode of this dev server instance.
 * @param hostUri The main host base url.
 * @param servedDevServerEntries The served webpack entries
 * @param forPageMiddlewares Allow us provider customized middlewares for `page`, `modules`
 * @param evolveOptions The evolve config options
 */
export const createPageMiddleware = (
  devHostUri: string,
  servedDevServerEntries: EvolveDevServerEntryMap,
  evolveOptions: HpsEvolveOptions
): RequestHandler[] => {
  const { staticPages } = evolveOptions.devServer || {};
  const handler = async (req: Request, res: Response) => {
    const staticPage = matchStaticPath(req.path, staticPages);
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
    } else if (staticPage) {
      html = await getStaticModuleHtml(staticPage, devHostUri, evolveOptions);
    } else {
      // For serve page modules
      html = await getPageModuleHtml(
        servedDevServerEntries,
        req,
        devHostUri,
        evolveOptions
      );
    }
    res.send(html);
  };
  return (evolveOptions.devServer?.middlewares || []).concat(handler);
};
