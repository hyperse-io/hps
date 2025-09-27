import express from 'express';
import https from 'node:https';
import type { DeepPartial } from '@hyperse/config-loader';
import { getAvailableDomain } from '@hyperse/hps-srv-common';
import { loadMockConfig } from '../load-config/load-mock-config.js';
import { type HpsMockOptions } from '../types/types-options.js';
import { attachMockMiddlewares } from './attach-mock-middlewares.js';

/**
 * Start a mock server for hps projects.
 * @param projectCwd The Root directory (workspace) of this project.
 * @param option the mock config options.
 * @returns the mock server domain `http://${hostname}:${String(mockPort)}`
 */
export const startMock = async (
  projectCwd: string = process.cwd(),
  overrideOptions: DeepPartial<HpsMockOptions> = {}
): Promise<string> => {
  const app = express();

  // Dynamic load hps mock configuration from `hps.mock.js`
  const mockOptions = await loadMockConfig(projectCwd, overrideOptions);

  const { domain, port, hostUri } = await getAvailableDomain({
    port: mockOptions.port,
    hostname: mockOptions.hostname,
    isHttps: !!mockOptions.https,
  });

  // Attach mock middlewares
  await attachMockMiddlewares(app, mockOptions, {
    hostUri: hostUri,
    port: port,
  });

  // Attach hostUri to application instance without last slash `/`.
  app.set('hostUri', hostUri);

  // Start mock server, return mock domain
  return new Promise<string>((resolve) => {
    // Https
    const httpsServer = mockOptions.https
      ? https.createServer(mockOptions.https, app)
      : app;
    httpsServer.listen(port, () => {
      resolve(domain);
    });
  });
};
