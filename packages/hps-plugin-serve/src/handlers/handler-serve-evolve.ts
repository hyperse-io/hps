import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { getMockCwd } from '@hyperse/hps-srv-mock';
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

  let finalOptions = normalizedOptions;
  // we always has `devServer` config node.
  if (normalizedOptions.devServer) {
    finalOptions = mergeOptions(normalizedOptions, {
      devServer: {
        mockOptions: {
          mockFilters: flags.mockFilters,
        },
      },
    });

    if (
      finalOptions?.devServer?.mockOptions &&
      !finalOptions.devServer.mockOptions.https
    ) {
      finalOptions.devServer.mockOptions.https = finalOptions.devServer?.https;
    }

    // Dynamic resolve mock work root directory
    const mockCwd = getMockCwd(finalOptions?.devServer?.mockOptions || {});

    // always push mockCwd into watchOptions ignored.
    if (Array.isArray(finalOptions.devServer?.watchOptions?.ignored)) {
      finalOptions.devServer?.watchOptions?.ignored.push(mockCwd);
    }
  }

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
