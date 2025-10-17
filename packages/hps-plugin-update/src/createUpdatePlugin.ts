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
            filter: {
              alias: 'f',
              type: [String],
              description: 'plugins.updatePlugin.flags.filter',
              default: [],
            },
            deep: {
              type: Boolean,
              description: 'plugins.updatePlugin.flags.deep',
              default: false,
            },
            reject: {
              alias: 'r',
              type: [String],
              description: 'plugins.updatePlugin.flags.reject',
              default: [],
            },
            verbose: {
              type: Boolean,
              description: 'plugins.updatePlugin.flags.verbose',
              default: false,
            },
          })
          .process(async (ctx) => {
            await updateWorkspacePackages({
              logger: ctx.logger,
              noColor: ctx.flags.noColor,
              projectCwd: ctx.flags.projectCwd,
              force: ctx.flags.force,
              filter: ctx.flags.filter,
              reject: ctx.flags.reject,
              verbose: ctx.flags.verbose,
              deep: ctx.flags.deep,
            });
          })
      );
      return cli;
    },
  });
};
