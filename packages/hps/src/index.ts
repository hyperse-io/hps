import {
  defineConfig as myDefineConfig,
  type UserConfigExport,
} from '@hyperse/config-loader';
import { createBuildPlugin } from '@hyperse/hps-plugin-build';
import { createDeployPlugin } from '@hyperse/hps-plugin-deploy';
import { createInfoPlugin } from '@hyperse/hps-plugin-info';
import { createLoadConfigPlugin } from '@hyperse/hps-plugin-load-config';
import { createMockPlugin } from '@hyperse/hps-plugin-mock';
import { createServePlugin } from '@hyperse/hps-plugin-serve';
import { createUpdatePlugin } from '@hyperse/hps-plugin-update';
import { createWizard } from '@hyperse/wizard';
import { createErrorPlugin } from '@hyperse/wizard-plugin-error';
import { createHelpPlugin } from '@hyperse/wizard-plugin-help';
import { createLoaderPlugin } from '@hyperse/wizard-plugin-loader';
import { createVersionPlugin } from '@hyperse/wizard-plugin-version';
import { hpsCliMessages } from './hpsCliMessages.js';
import type { DefineConfigFn, EvolveConfigBase } from './types/index.js';
import type { GetNameToContext } from './types/types-get-name-to-context.js';
import { getCliPackage } from './utils/getCliPackage.js';
import { resolveVersion } from './version.js';

const cliPackage = await getCliPackage();
const version = resolveVersion();
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
const loadConfigPlugin = createLoadConfigPlugin({
  configFile: 'hps',
});

const cli = createWizard({
  name: 'hps',
  description: 'cli.hpsCli.description',
  version: (t) => t('cli.hpsCli.version', { version }),
  localeMessages: hpsCliMessages,
  locale: 'en',
})
  .use(loadConfigPlugin)
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

const defineConfig: DefineConfigFn<GetNameToContext<typeof cli>> = (
  userConfig: UserConfigExport<GetNameToContext<typeof cli>, EvolveConfigBase>
) => {
  return myDefineConfig(userConfig);
};

export { cli, defineConfig };
