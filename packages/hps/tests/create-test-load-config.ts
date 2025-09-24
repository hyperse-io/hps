import { loadHpsConfigFile } from '@hyperse/hps-plugin-load-config';
import { requireResolve } from '@hyperse/hps-srv-common';
import { definePlugin } from '@hyperse/wizard';

export const createTestLoadConfig = (options?: { tsconfigPath?: string }) => {
  const { tsconfigPath = requireResolve(import.meta.url, '../tsconfig.json') } =
    options || {};
  return definePlugin({
    name: () => 'test-load-config',
    localeMessages: {},
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
            configFile: 'hps',
            loaderOptions: {
              externals: [/^@hyperse\/.*/],
              externalExclude: (moduleId: string | RegExp) => {
                return moduleId.toString().startsWith('@hyperse/');
              },
              tsconfig: tsconfigPath,
            },
          }
        );
        return hpsEvolveOptions;
      });
      return wizard;
    },
  });
};
