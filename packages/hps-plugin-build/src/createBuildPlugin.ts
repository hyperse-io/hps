import { defineCommand, definePlugin } from '@hyperse/wizard';
import { evolveBuildCmd } from './evolveBuildCmd.js';
import { buildPluginMessages } from './i18n/messages.js';

export const createBuildPlugin = () => {
  return definePlugin({
    name: 'plugins.buildPlugin.name',
    localeMessages: buildPluginMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand('build', {
          description: 'plugins.buildPlugin.command.description',
          example: 'plugins.buildPlugin.command.example',
        }).use(evolveBuildCmd)
      );
      return cli;
    },
  });
};
