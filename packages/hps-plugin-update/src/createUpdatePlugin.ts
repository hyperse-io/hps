import { defineCommand, definePlugin } from '@hyperse/wizard';
import { updatePluginMessages } from './i18n/messages.js';
import { updateWorkspacePackages } from './utils/updateWorkspacePackages.js';

export const createUpdatePlugin = () => {
  return definePlugin({
    name: 'plugins.updatePlugin.name',
    localeMessages: updatePluginMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand('update', {
          description: 'plugins.updatePlugin.command.description',
          example: 'plugins.updatePlugin.command.example',
        })
          .flags({
            force: {
              type: Boolean,
              default: false,
              description: 'plugins.updatePlugin.flags.force',
            },
            projectCwd: {
              type: String,
              description: 'plugins.updatePlugin.flags.projectCwd',
              default: process.cwd(),
            },
          })
          .process(async (ctx) => {
            await updateWorkspacePackages({
              logger: ctx.logger,
              noColor: ctx.flags.noColor,
              projectCwd: ctx.flags.projectCwd,
              force: ctx.flags.force,
            });
          })
      );
      return cli;
    },
  });
};
