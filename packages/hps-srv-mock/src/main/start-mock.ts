import express from 'express';
import https from 'node:https';
import type { DeepPartial } from '@hyperse/config-loader';
import { requireResolve } from '@hyperse/hps-srv-common';
import { getAvailableDomain } from '@hyperse/hps-srv-common';
import { type MockConfigBase } from '../define-config/define-config.js';
import {
  type ConfigLoaderOptions,
  loadMockConfig,
} from '../load-config/load-mock-config.js';
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
  overrideOptions: DeepPartial<HpsMockOptions> = {},
  configLoaderOptions?: ConfigLoaderOptions
): Promise<string> => {
  const app = express();
  const command: MockConfigBase = {
    projectCwd,
    resolve: requireResolve,
  };
  // Dynamic load hps mock configuration from `hps.mock.js`
  const mockOptions = await loadMockConfig(
    command,
    projectCwd,
    overrideOptions,
    configLoaderOptions
  );

  // Attach mock middlewares
  await attachMockMiddlewares(app, mockOptions);

  const { domain, port, hostUri } = await getAvailableDomain({
    port: mockOptions.port,
    hostname: mockOptions.hostname,
    isHttps: !!mockOptions.https,
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
