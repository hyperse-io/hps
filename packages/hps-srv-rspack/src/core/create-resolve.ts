import { join } from 'node:path';
import { mergeOptions } from '@hyperse/hps-srv-common';
import type { RspackOptions } from '@rspack/core';
import { type HpsEvolveRspackOptions } from '../types/types-rspack.js';

export const createResolve = (
  projectCwd: string,
  rspackOptions?: HpsEvolveRspackOptions
) => {
  const resolve: RspackOptions['resolve'] = {
    mainFields: ['browser', 'module', 'main'],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.mjs',
      '.cjs',
      '.mts',
      '.cts',
      '.json',
    ],
    // Add support for TypeScripts fully qualified ESM imports.
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
      '.jsx': ['.jsx', '.tsx'],
    },
    tsConfig: {
      configFile: join(projectCwd, 'tsconfig.json'),
    },
  };
  return mergeOptions(resolve, rspackOptions?.resolve || {});
};
