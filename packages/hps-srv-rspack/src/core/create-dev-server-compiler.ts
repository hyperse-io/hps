import { join } from 'node:path';
import type { Compiler } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';
import { type HpsEvolveOptions } from '../types/types-options.js';

/**
 * Integrated rspack-dev-server with `mock` server together
 * @param compiler Rspack compiler(s)
 * @param enabledHmr Value indicates if we need to liveReload or `HMR`
 * @param devPort The port number of `@hyperse/hps-srv-rspack`
 * @param publicIp The public ip address of local server
 * @param evolveOptions The configuration of `@hyperse/hps-srv-rspack` (HpsEvolveOptions)
 */
export const createDevServerCompiler = (
  compiler: Compiler,
  enabledHmr: boolean,
  devPort: number,
  publicIp: string,
  evolveOptions: HpsEvolveOptions
): Promise<boolean> => {
  const { projectCwd, devServer } = evolveOptions;

  const server = new RspackDevServer(
    {
      server: {
        type: devServer?.https ? 'https' : 'http',
        options: {
          // Load https
          ...devServer?.https,
        },
      },
      open: false,
      compress: true,
      port: devPort,
      hot: enabledHmr,
      liveReload: !enabledHmr,
      // Enable firewall or set hosts that are allowed to access the dev server.
      allowedHosts: 'all',
      static: {
        directory: `${join(projectCwd, '/public')}`,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      setupMiddlewares(middlewares) {
        if (devServer?.devBeforeMiddlewares) {
          middlewares.unshift(...devServer.devBeforeMiddlewares);
        }
        if (devServer?.devAfterMiddlewares) {
          middlewares.push(...devServer.devAfterMiddlewares);
        }
        return middlewares;
      },
      client: {
        progress: true,
        overlay: devServer?.clientOverlay,
        webSocketURL:
          devServer?.webSocketURL === 'localIp'
            ? {
                hostname: publicIp || undefined,
              }
            : {
                // always use public ip address cause of charles proxy to mobile devices don't work on  `ws://${domain host}:port`
                // if we use https, we don't need to specify the hostname or specify the https domain address
                hostname: '0.0.0.0',
                ...devServer?.webSocketURL,
              },
      },
    },
    compiler
  );
  return new Promise((resolve, reject) => {
    server.startCallback((err) => {
      if (err) {
        return reject(err);
      }
      resolve(true);
    });
  });
};
