import { resolve } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { type Configuration, rspack } from '@rspack/core';
import { pluginName } from '../constants.js';
import { createWatchOptions } from '../helpers/helper-create-watch-options.js';
import { createTsCheckerPlugins } from '../plugins/index.js';
import type { ForgeTsCheckerOptions } from '../types/type-options.js';

export const createTsCheckerCompilerConfig = (
  options: ForgeTsCheckerOptions
): Configuration | false => {
  const {
    serveMode,
    runTsChecker = true,
    projectCwd = process.cwd(),
  } = options;

  if (!runTsChecker) {
    return false;
  }

  const mode = serveMode ? 'development' : 'production';

  const watchOptions = createWatchOptions(options);

  const plugins = [...createTsCheckerPlugins(options)];

  const config: Configuration = {
    context: projectCwd,
    mode: mode,
    watch: serveMode,
    name: pluginName,
    entry: ['./entry.js'],
    resolve: {
      // plugins: [new CustomResolverPlugin()],
      alias: {
        './entry.js': resolve(import.meta.dirname, '../compiler/entry.js'),
      },
    },
    plugins: plugins,
    watchOptions: watchOptions,
    devtool: false,
    cache: true,
    output: {
      path: getDirname(import.meta.url, './'),
      filename: '.ts-checker-compiler-bundle.js',
    },
  };

  return config;
};

export const createTsCheckerCompiler = async (
  options: ForgeTsCheckerOptions
): Promise<boolean> => {
  const config = createTsCheckerCompilerConfig(options);

  if (!config) {
    return false;
  }

  return new Promise((resolve, reject) => {
    const compiler = rspack(config, (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve(true);
    });
    process.on('exit', () => {
      compiler?.close(() => {});
    });
  });
};
