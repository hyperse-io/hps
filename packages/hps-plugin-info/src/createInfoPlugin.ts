import { defineCommand, definePlugin } from '@hyperse/wizard';
import { infoPluginMessages } from './i18n/messages.js';
import { printBanner } from './print/printBanner.js';
import { printCliVersion } from './print/printCliVersion.js';
import { printDependency } from './print/printDependency.js';
import { printSystemInformation } from './print/printSystemInformation.js';
import type { PackageJson } from './types.js';

export type CreateInfoPluginOptions = {
  cliPackage?: PackageJson;
};
export const createInfoPlugin = (options: CreateInfoPluginOptions) => {
  return definePlugin({
    name: 'plugins.infoPlugin.name',
    localeMessages: infoPluginMessages,
    setup: (wizard, { noColor }) => {
      const cli = wizard.register(
        defineCommand('info', {
          description: 'plugins.infoPlugin.command.description',
          example: 'plugins.infoPlugin.command.example',
        }).process(async () => {
          await printBanner();
          await printCliVersion({
            noColor,
            cliPackage: options.cliPackage,
          });
          await printSystemInformation({
            noColor,
          });
          await printDependency({
            noColor,
            cliPackage: options.cliPackage,
          });
        })
      );

      return cli;
    },
  });
};
