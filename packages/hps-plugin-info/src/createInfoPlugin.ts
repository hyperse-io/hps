import { defineCommand, definePlugin } from '@hyperse/wizard';
import { infoPluginMessages } from './i18n/messages.js';
import { printBanner } from './print/printBanner.js';
import { printCliVersion } from './print/printCliVersion.js';
import { printDependency } from './print/printDependency.js';
import { printSystemInformation } from './print/printSystemInformation.js';

export const createInfoPlugin = () => {
  return definePlugin({
    name: 'plugins.infoPlugin.name',
    localeMessages: infoPluginMessages,
    setup: (wizard, { noColor }) => {
      const cli = wizard.register(
        defineCommand('info', {
          description: 'plugins.infoPlugin.command.description',
          example: 'plugins.infoPlugin.command.example',
        }).process(async () => {
          await printBanner(noColor);
          await printCliVersion(noColor);
          await printSystemInformation(noColor);
          await printDependency(noColor);
        })
      );

      return cli;
    },
  });
};
