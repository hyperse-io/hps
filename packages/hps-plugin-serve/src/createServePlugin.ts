import type { HpsEvolveOptions } from '@hyperse/hps-srv-rspack';
import { defineCommand, definePlugin } from '@hyperse/wizard';
import { handlerServeEvolve } from './handlers/handler-serve-evolve.js';
import { servePluginMessages } from './i18n/messages.js';

export type EvolveServeCmdContext = Omit<HpsEvolveOptions, 'projectCwd'> & {
  projectCwd?: string;
};

export const createServePlugin = () => {
  return definePlugin({
    name: 'plugins.servePlugin.name',
    localeMessages: servePluginMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand('serve', {
          description: 'plugins.servePlugin.command.description',
          example: 'plugins.servePlugin.command.example',
        }).use(
          defineCommand<'evolve', EvolveServeCmdContext>('evolve', {
            description: 'plugins.servePlugin.subCommands.evolve.description',
            example: 'plugins.servePlugin.subCommands.evolve.example',
          })
            .flags({
              staticMode: {
                type: Boolean,
                alias: 's',
                description:
                  'plugins.servePlugin.subCommands.evolve.flags.staticMode',
                default: false,
              },
              modules: {
                type: [String],
                alias: 'm',
                description:
                  'plugins.servePlugin.subCommands.evolve.flags.modules',
                default: [`.*`],
              },
              mockFilters: {
                type: [String],
                description:
                  'plugins.servePlugin.subCommands.evolve.flags.mockFilters',
                default: ['.*'],
              },
            })
            .process(async (ctx) => {
              const flags = ctx.flags;
              const configOptions = ctx.ctx;
              if (!configOptions) {
                throw new Error('serve evolve configOptions is required');
              }
              await handlerServeEvolve(flags, configOptions);
            })
        )
      );
      return cli;
    },
  });
};
