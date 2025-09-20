import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import type { HpsEvolveOptions } from '@hyperse/hps-srv-rspack';
import { defineCommand } from '@hyperse/wizard';

export type EvolveBuildCmdContext = Omit<HpsEvolveOptions, 'projectCwd'> & {
  projectCwd?: string;
};

export const evolveBuildCmd = defineCommand<'evolve', EvolveBuildCmdContext>(
  'evolve',
  {
    description: 'plugins.buildPlugin.subCommands.evolve.description',
    example: 'plugins.buildPlugin.subCommands.evolve.example',
  }
)
  .flags({
    compress: {
      type: Boolean,
      alias: 'c',
      description: 'plugins.buildPlugin.subCommands.evolve.flags.compress',
      default: true,
    },
    modules: {
      type: [String],
      alias: 'm',
      description: 'plugins.buildPlugin.subCommands.evolve.flags.modules',
      default: [`.*`],
    },
  })
  .process(async (ctx) => {
    const flags = ctx.flags;
    const configOptions = ctx.ctx;
    if (!configOptions) {
      throw new Error('build evolve configOptions is required');
    }
    try {
      const evolveModule = await import('@hyperse/hps-srv-rspack');
      const start = Date.now();
      const getDuration = () => {
        return `${Math.floor(Date.now() - start)}ms`;
      };

      const { projectCwd, modules } = flags;
      const normalizedOptions = mergeOptions<Partial<HpsEvolveOptions>>(
        configOptions,
        {
          projectCwd: flags.projectCwd,
          rspack: {
            minimizer: flags.compress === false ? false : undefined,
          },
        }
      );

      logger.info(`Building...`);
      await evolveModule.startBuild(projectCwd, modules, normalizedOptions);
      logger.info(`Building success in ${getDuration()}`);
    } catch (err: any) {
      logger.error(err);
    }
  });
