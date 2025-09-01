import { createDeployPlugin } from '@hyperse/hps-plugin-deploy';
import { createInfoPlugin } from '@hyperse/hps-plugin-info';
import { createUpdatePlugin } from '@hyperse/hps-plugin-update';
import { createWizard } from '@hyperse/wizard';
import { createErrorPlugin } from '@hyperse/wizard-plugin-error';
import { createHelpPlugin } from '@hyperse/wizard-plugin-help';
import { createLoaderPlugin } from '@hyperse/wizard-plugin-loader';
import { createVersionPlugin } from '@hyperse/wizard-plugin-version';
import { hpsCliMessages } from './hpsCliMessages.js';
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

const cli = createWizard({
  name: 'hps',
  description: 'cli.hpsCli.description',
  version: (t) => t('cli.hpsCli.version', { version }),
  localeMessages: hpsCliMessages,
})
  .use(helpPlugin)
  .use(versionPlugin)
  .use(errorPlugin)
  .use(loaderPlugin)
  .use(infoPlugin)
  .use(deployPlugin)
  .use(updatePlugin);

export { cli };
