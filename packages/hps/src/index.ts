import { createBuildPlugin } from '@hyperse/hps-plugin-build';
import { createDeployPlugin } from '@hyperse/hps-plugin-deploy';
import { createInfoPlugin } from '@hyperse/hps-plugin-info';
import { createMockPlugin } from '@hyperse/hps-plugin-mock';
import { createServePlugin } from '@hyperse/hps-plugin-serve';
import { createUpdatePlugin } from '@hyperse/hps-plugin-update';
import { commonLogger } from '@hyperse/hps-srv-common';
import { createWizard, definePlugin } from '@hyperse/wizard';
import { createErrorPlugin } from '@hyperse/wizard-plugin-error';
import { createHelpPlugin } from '@hyperse/wizard-plugin-help';
import { createLoaderPlugin } from '@hyperse/wizard-plugin-loader';
import { createVersionPlugin } from '@hyperse/wizard-plugin-version';
import { myDefineConfig } from './define-config/define-config.js';
import { hpsCliMessages } from './hpsCliMessages.js';
import type { NameToContext } from './types/types-name-to-context.js';
import { getCliPackage } from './utils/getCliPackage.js';
export * from './define-config/index.js';
export * from './types/index.js';

const cliPackage = await getCliPackage();
const helpPlugin = createHelpPlugin();
const versionPlugin = createVersionPlugin();
const errorPlugin = createErrorPlugin();
const loaderPlugin = await createLoaderPlugin({
  pluginPackPattern: ['hps-plugin-*'],
  pluginSearchDirs: [],
});

const infoPlugin = createInfoPlugin({
  cliPackage,
});
const deployPlugin = createDeployPlugin();
const updatePlugin = createUpdatePlugin();
const buildPlugin = createBuildPlugin();
const servePlugin = createServePlugin();
const mockPlugin = createMockPlugin();
const version = cliPackage?.version ?? '0.0.0';

const cli = createWizard({
  name: 'hps',
  description: 'cli.hpsCli.description',
  version: (t) => t('cli.hpsCli.version', { version }),
  localeMessages: hpsCliMessages,
  locale: 'en',
  configLoaderOptions: {
    configFile: 'hps',
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
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
  .use(helpPlugin)
  .use(versionPlugin)
  .use(errorPlugin)
  .use(loaderPlugin)
  .use(infoPlugin)
  .use(deployPlugin)
  .use(updatePlugin)
  .use(buildPlugin)
  .use(servePlugin)
  .use(mockPlugin);

const defineConfig = myDefineConfig<typeof cli>;

export type CommandConfiguration<Key extends keyof NameToContext<typeof cli>> =
  NameToContext<typeof cli>[Key];

export { cli, defineConfig };
