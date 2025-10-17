import { createBuildPlugin } from '@hyperse/hps-plugin-build';
import { createMockPlugin } from '@hyperse/hps-plugin-mock';
import { createServePlugin } from '@hyperse/hps-plugin-serve';
import { commonLogger, requireResolve } from '@hyperse/hps-srv-common';
import { createWizard, definePlugin } from '@hyperse/wizard';
import { createErrorPlugin } from '@hyperse/wizard-plugin-error';

const errorPlugin = createErrorPlugin();

const buildPlugin = createBuildPlugin();
const servePlugin = createServePlugin();
const mockPlugin = createMockPlugin();

export const testCli = createWizard({
  name: 'testCli',
  description: () => 'test cli',
  version: () => 'test v1.0.1',
  locale: 'en',
  configLoaderOptions: {
    configFile: 'hps',
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
      externalExclude: (moduleId: string | RegExp) => {
        return moduleId.toString().startsWith('@hyperse/');
      },
      tsconfig: requireResolve(import.meta.url, '../tsconfig.json'),
    },
  },
})
  .use(
    definePlugin({
      name: 'cli.hpsCli.setCommonLogger',
      setup: (wizard) => {
        wizard.interceptor(async (ctx, next) => {
          commonLogger.setupCommonLogger(ctx.logger);
          await next();
        });
        return wizard;
      },
    })
  )
  .use(errorPlugin)
  .use(buildPlugin)
  .use(servePlugin)
  .use(mockPlugin);
