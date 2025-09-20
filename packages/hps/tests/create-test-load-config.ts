import { loadHpsConfigFile } from '@hyperse/hps-plugin-load-config';
import { requireResolve } from '@hyperse/hps-srv-common';
import { definePlugin } from '@hyperse/wizard';

export const createTestLoadConfig = () => {
  return definePlugin({
    name: () => 'test-load-config',
    localeMessages: {},
    setup: (wizard) => {
      wizard.setupContextLoader(async (flags) => {
        const projectCwd = flags.projectCwd;
        const hpsEvolveOptions = await loadHpsConfigFile(projectCwd, {
          projectCwd: projectCwd,
          resolve: requireResolve,
        });
        return hpsEvolveOptions;
      });
      return wizard;
    },
  });
};
