import { createInfoPlugin } from '@hyperse/hps-plugin-info';
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

const cli = createWizard({
  name: 'hps',
  description: 'cli.hpsCli.description',
  version: (t) => t('cli.hpsCli.version', { version }),
  localeMessages: hpsCliMessages,
});

cli.use(helpPlugin);
cli.use(versionPlugin);
cli.use(errorPlugin);
cli.use(loaderPlugin);
cli.use(infoPlugin);

export { cli };
