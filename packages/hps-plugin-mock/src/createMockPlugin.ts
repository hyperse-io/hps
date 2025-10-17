import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { chalk } from '@hyperse/hps-srv-common';
import type { HpsMockOptions } from '@hyperse/hps-srv-mock';
import { defineCommand, definePlugin } from '@hyperse/wizard';
import { mockPluginMessages } from './i18n/messages.js';

export type MockCmdContext = HpsMockOptions;

export const createMockPlugin = () => {
  return definePlugin({
    name: 'plugins.mockPlugin.name',
    localeMessages: mockPluginMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand<'mock', MockCmdContext>('mock', {
          description: 'plugins.mockPlugin.command.description',
          example: 'plugins.mockPlugin.command.example',
          loadConfig: true,
        })
          .flags({
            hostname: {
              type: String,
              description: 'plugins.mockPlugin.flags.hostname',
            },
            port: {
              type: Number,
              description: 'plugins.mockPlugin.flags.port',
            },
            mockFilters: {
              type: [String],
              description: 'plugins.mockPlugin.flags.mockFilters',
              default: ['.*'],
            },
          })
          .process(async (ctx) => {
            const flags = ctx.flags;
            const { projectCwd, port, hostname, mockFilters } = flags;
            const configOptions = ctx.ctx;
            if (!configOptions) {
              throw new Error('mock configOptions is required');
            }
            const mockModule = await import('@hyperse/hps-srv-mock');

            const normalizedOptions = mergeOptions(configOptions, {
              projectCwd,
              port,
              hostname,
              mockFilters,
            });
            const domain = await mockModule.startMock(
              projectCwd,
              normalizedOptions
            );
            logger.info(
              `Start an mock service on "${chalk(['magenta'])(domain)}"`
            );
          })
      );
      return cli;
    },
  });
};
