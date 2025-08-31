import { defineCommand, definePlugin } from '@hyperse/wizard';
import { deployPluginMessages } from './i18n/messages.js';
import { AliyunAssetDeployStrategy } from './strategy/aliyun/AliyunAssetDeployStrategy.js';
import { AssetDeployService } from './strategy/AssetDeployService.js';
import type { AssetDeployStrategy } from './strategy/AssetDeployStrategy.js';

export type CreateDeployPluginOptions = {
  /**
   * The deploy strategies.
   */
  deployStrategies?: AssetDeployStrategy[];
};

// Default deploy strategies
const defaultStrategies = [new AliyunAssetDeployStrategy()];

export const createDeployPlugin = (options: CreateDeployPluginOptions) => {
  const deployStrategies = [
    ...defaultStrategies,
    ...(options.deployStrategies || []),
  ];

  return definePlugin({
    name: 'plugins.deployPlugin.name',
    localeMessages: deployPluginMessages,
    setup: (wizard) => {
      const cli = wizard.register(
        defineCommand('deploy', {
          description: 'plugins.deployPlugin.command.description',
          example: 'plugins.deployPlugin.command.example',
        })
          .flags({
            projectCwd: {
              alias: 'p',
              description: 'plugins.deployPlugin.flags.projectCwd',
              type: String,
              default: '',
            },
            target: {
              alias: 't',
              required: true,
              description: (t) =>
                t('plugins.deployPlugin.flags.target', {
                  target: deployStrategies
                    .map((strategy) => strategy.name)
                    .join(', '),
                }),
              type: [String],
            },
            prefix: {
              description: 'plugins.deployPlugin.flags.prefix',
              type: String,
              default: '',
            },
            match: {
              alias: 'm',
              description: 'plugins.deployPlugin.flags.match',
              type: [String],
              default: [],
            },
            ignore: {
              alias: 'i',
              description: 'plugins.deployPlugin.flags.ignore',
              type: [String],
              default: [],
            },
          })
          .process(async (ctx) => {
            const deployService = new AssetDeployService({
              logger: ctx.logger,
              noColor: ctx.flags.noColor,
              projectCwd: ctx.flags.projectCwd,
              target: ctx.flags.target,
              prefix: ctx.flags.prefix,
              matchPatterns: ctx.flags.match,
              ignorePatterns: ctx.flags.ignore,
              deployStrategies,
            });

            await deployService.deploy();
          })
      );

      return cli;
    },
  });
};
