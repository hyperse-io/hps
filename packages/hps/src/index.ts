import { createWizard } from '@hyperse/wizard';
import { createErrorPlugin } from '@hyperse/wizard-plugin-error';
import { createHelpPlugin } from '@hyperse/wizard-plugin-help';
import { createVersionPlugin } from '@hyperse/wizard-plugin-version';
import { hpsCliMessages } from './hpsCliMessages.js';
import { resolveVersion } from './version.js';

const version = resolveVersion();
const helpPlugin = createHelpPlugin();
const versionPlugin = createVersionPlugin();
const errorPlugin = createErrorPlugin();

const cli = createWizard({
  name: 'hps',
  description: 'cli.hpsCli.description',
  version: (t) => t('cli.hpsCli.version', { version }),
  localeMessages: hpsCliMessages,
});

cli.use(helpPlugin);
cli.use(versionPlugin);
cli.use(errorPlugin);

export { cli };
