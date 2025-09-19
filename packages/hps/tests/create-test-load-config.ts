import { loadHpsConfigFile } from '@hyperse/hps-plugin-load-config';
import { requireResolve } from '@hyperse/hps-srv-common';
import { createConfigLoaderOptions } from '@hyperse/hps-srv-testing';
import { definePlugin } from '@hyperse/wizard';

export const createTestLoadConfig = ({
  configFile = 'hps-evolve',
  tsconfig,
}: {
  configFile?: string;
  tsconfig: string;
}) => {
  return definePlugin({
    name: () => 'test-load-config',
    localeMessages: {},
    setup: (wizard) => {
      wizard.setupContextLoader(async (flags) => {
        const projectCwd = flags.projectCwd;
        const configLoaderOptions = await createConfigLoaderOptions(
          tsconfig,
          configFile,
          []
        );
        const hpsEvolveOptions = await loadHpsConfigFile(
          projectCwd,
          {
            projectCwd: projectCwd,
            resolve: requireResolve,
          },
          configLoaderOptions
        );

        return hpsEvolveOptions;
      });
      return wizard;
    },
  });
};
