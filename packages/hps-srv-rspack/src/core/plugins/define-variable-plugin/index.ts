import { DefinePlugin } from '@rspack/core';
import type { HpsEvolveOptions } from '../../../types/types-options.js';
/**
 * The DefinePlugin replaces variables in your code with other values or expressions at compile time.
 * ```ts
 * `process.env.HPS_PUBLIC_SERVE_MODE`
 * `process.env.HPS_PUBLIC_BUILD_DATE`
 * ```
 * @returns
 */
export const createDefineVariablesPlugins = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
) => {
  const rspack = evolveOptions.rspack || {};

  const processEnv = process.env;
  const publicEnvs: Record<string, string> = {};
  if (processEnv) {
    Object.keys(processEnv)
      .filter((key) => key.startsWith('HPS_PUBLIC_'))
      .forEach((key) => {
        publicEnvs[key] = JSON.stringify(processEnv[key]);
      });
  }
  return [
    new DefinePlugin({
      'process.env.HPS_PUBLIC_SERVE_MODE': JSON.stringify(serveMode),
      'process.env.HPS_PUBLIC_BUILD_DATE': JSON.stringify(
        new Date().toISOString()
      ),
      ...publicEnvs,
      ...(rspack.plugins?.definePlugin?.variables || {}),
    }),
  ];
};
