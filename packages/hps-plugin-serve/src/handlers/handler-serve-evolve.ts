import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import type { HpsEvolveOptions } from '@hyperse/hps-srv-rspack';

export const handlerServeEvolve = async (
  flags: {
    projectCwd: string;
    modules: string[];
    staticMode: boolean;
    mockFilters: string[];
  },
  configOptions: Partial<HpsEvolveOptions>
) => {
  const { projectCwd, modules, staticMode } = flags;
  const normalizedOptions = mergeOptions<Partial<HpsEvolveOptions>>(
    configOptions,
    {
      projectCwd: flags.projectCwd,
    }
  );

  const finalOptions = mergeOptions(normalizedOptions, {
    devServer: {
      mockOptions: {
        mockFilters: flags.mockFilters,
      },
    },
  });

  const evolveModule = await import('@hyperse/hps-srv-rspack');
  if (staticMode) {
    logger.info('Serve an evolve app `static` mode...');
    await evolveModule.startStatic(projectCwd, finalOptions);
    logger.info('Serve an evolve app `static` mode successfully');
  } else {
    logger.info(`Serve an evolve app...`);
    await evolveModule.startServe(projectCwd, modules, finalOptions);
    logger.info('Serve an evolve app successfully');
  }
};
