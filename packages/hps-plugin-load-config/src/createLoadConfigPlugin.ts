import { requireResolve } from '@hyperse/hps-srv-common';
import { definePlugin } from '@hyperse/wizard';
import { loadHpsConfigFile } from './helpers/helper-load-hps-config.js';
import { loadConfigPluginMessages } from './i18n/messages.js';

export type LoadConfigOptions = {
  /**
   * The config file name.
   *
   * @default 'hps-config'
   */
  configFile?: string;
};

export const createLoadConfigPlugin = (options?: LoadConfigOptions) => {
  const { configFile = 'hps' } = options || {};
  return definePlugin({
    name: 'plugins.loadConfigPlugin.name',
    localeMessages: loadConfigPluginMessages,
    setup: (wizard) => {
      wizard.setupContextLoader(async (flags) => {
        const projectCwd = flags.projectCwd;

        const hpsEvolveOptions = await loadHpsConfigFile(
          projectCwd,
          {
            projectCwd: projectCwd,
            resolve: requireResolve,
          },
          {
            configFile: configFile,
            loaderOptions: {
              externals: [/^@hyperse\/.*/],
            },
          }
        );

        return hpsEvolveOptions;
      });
      return wizard;
    },
  });
};
