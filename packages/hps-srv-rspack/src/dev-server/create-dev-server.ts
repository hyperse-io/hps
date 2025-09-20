import express from 'express';
import https from 'node:https';
import { getAvailableDomain } from '@hyperse/hps-srv-common';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const createDevServer = async (
  evolveOptions: HpsEvolveOptions
): Promise<{
  devPort: number;
  devHostUri: string;
  publicIp: string;
  app: typeof app;
}> => {
  const app = express();
  const mockOptions = evolveOptions.devServer?.mockOptions;
  const { port, hostUri, publicIp } = await getAvailableDomain({
    port: mockOptions?.port,
    hostname: mockOptions?.hostname,
    isHttps: !!mockOptions?.https,
  });

  return new Promise<{
    devPort: number;
    devHostUri: string;
    publicIp: string;
    app: typeof app;
  }>((resolve) => {
    // Https
    const httpsServer = evolveOptions.devServer?.https
      ? https.createServer(evolveOptions.devServer?.https, app)
      : app;

    // Attach hostUri to application instance without last slash `/`.
    app.set('hostUri', hostUri);

    httpsServer.listen(port, () => {
      resolve({
        app,
        publicIp,
        devHostUri: hostUri,
        devPort: port,
      });
    });
  });
};
