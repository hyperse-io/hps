import {
  chalk,
  getAvailableDomain,
  logger,
  mergeOptions,
} from '@hyperse/hps-srv-common';
import type { HpsEvolveOptions } from '@hyperse/hps-srv-rspack';

export const handlerServeMock = async (
  flags: {
    projectCwd: string;
    mockFilters: string[];
    port?: number;
    hostname?: string;
  },
  configOptions: HpsEvolveOptions
) => {
  const mockOptions = configOptions.devServer?.mockOptions;
  if (!mockOptions) {
    logger.warn('mock options is not found, skip mock server');
    return;
  }

  const { projectCwd, port, hostname, mockFilters } = flags;
  const normalizedOptions = mergeOptions(mockOptions, {
    port,
    hostname,
    mockFilters,
  });

  const { port: mockPort } = await getAvailableDomain(normalizedOptions || {});

  const finalMockOptions = mergeOptions(normalizedOptions, {
    port: mockPort,
  });

  logger.info(`Start mock server...`);
  const mockModule = await import('@hyperse/hps-srv-mock');
  const domain = await mockModule.startMock(projectCwd, finalMockOptions);
  logger.info(`Start an mock service on "${chalk(['cyan'])(domain)}"`);
};
