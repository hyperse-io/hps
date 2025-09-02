import { defineCommand, definePlugin } from '@hyperse/wizard';
import { deployPluginMessages } from './i18n/messages.js';
import { AliyunAssetDeployStrategy } from './strategy/aliyun/AliyunAssetDeployStrategy.js';
import { AssetDeployService } from './strategy/AssetDeployService.js';
import type { AssetDeployStrategy } from './strategy/AssetDeployStrategy.js';

/**
 * Configuration options for creating a deploy plugin
 */
export type CreateDeployPluginOptions = {
  /**
   * Custom deploy strategies to use in addition to the default ones
   */
  deployStrategies?: AssetDeployStrategy[];
};

/**
 * Default deploy strategies that are always included
 */
const DEFAULT_STRATEGIES = [new AliyunAssetDeployStrategy()];

/**
 * Creates a deploy plugin for the HPS wizard
 *
 * @param options - Configuration options for the plugin
 * @returns A configured deploy plugin
 *
 * @example
 * ```typescript
 * const deployPlugin = createDeployPlugin({
 *   deployStrategies: [new CustomDeployStrategy()]
 * });
 * ```
 */
export const createDeployPlugin = (options: CreateDeployPluginOptions = {}) => {
  const deployStrategies = [
    ...DEFAULT_STRATEGIES,
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
              description: 'plugins.deployPlugin.flags.projectCwd',
              type: String,
              default: process.cwd(),
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
              alias: 'p',
              description: 'plugins.deployPlugin.flags.prefix',
              type: String,
              default: '',
            },
            match: {
              alias: 'm',
              description: 'plugins.deployPlugin.flags.match',
              type: [String],
              default: ['**/*.{png,jpg,jpeg,gif,svg}'],
            },
            ignore: {
              alias: 'i',
              description: 'plugins.deployPlugin.flags.ignore',
              type: [String],
            },
            overrideExistFile: {
              description: 'plugins.deployPlugin.flags.overrideExistFile',
              type: Boolean,
              default: false,
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
              overrideExistFile: ctx.flags.overrideExistFile,
              deployStrategies,
            });

            await deployService.deploy();
          })
      );
      return cli;
    },
  });
};
