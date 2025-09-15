import { builtinModules, isBuiltin } from 'node:module';
import {
  type InputOption,
  type Plugin,
  rollup,
  type RollupOutput,
} from 'rollup';
import pluginCommonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import {
  createTestOutput,
  type OutputInputOptions,
} from './create-test-output.js';

/**
 * Normally it will used to do some testings for `@flatjs/forge-plugin-*`
 * @param options
 * @returns
 */
export const createTestBuild = async (options: {
  input: InputOption;
  outputOptions: OutputInputOptions;
  plugins: Plugin[];
  external?: string[];
}): Promise<RollupOutput> => {
  const { plugins, input, external, outputOptions } = options;
  const defaultPlugins = [
    nodeResolve({
      extensions: [
        '.js',
        '.ts',
        '.tsx',
        '.jsx',
        '.mjs',
        '.cjs',
        '.mts',
        '.cts',
        '.json',
        '.vue',
      ],
    }),
    (pluginCommonjs.default || pluginCommonjs)({}),
  ];

  const bundle = await rollup({
    input: input as InputOption,
    external: (moduleId) => {
      if (!external || !external.length) {
        return false;
      }
      const isExternal = (external || []).find((externalModule: string) => {
        // moduleId: `@dimjs/utils/esm/class-names`
        return moduleId.startsWith(externalModule);
      });
      return (
        !!isExternal || builtinModules.includes(moduleId) || isBuiltin(moduleId)
      );
    },
    cache: false,
    preserveSymlinks: true,
    plugins: defaultPlugins.concat(plugins),
  });
  const output = createTestOutput(outputOptions);
  return bundle.write(output);
};
