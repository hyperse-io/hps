import { DefinePlugin } from '@rspack/core';
import type { HpsEvolveOptions } from '../../../types/types-options.js';
/**
 * The DefinePlugin replaces variables in your code with other values or expressions at compile time.
 * ```ts
 * `__SENTRY_DEBUG__`
 * `process.env.FLAT_BUILD_DATE`
 * `process.env.FLAT_COMMIT_HASH`
 * `process.env.FLAT_BRANCH_NAME`
 * `process.env.FLAT_RELEASE_VERSION`
 * ```
 * @returns
 */
export const createDefineVariablesPlugins = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions
) => {
  const rspack = evolveOptions.rspack || {};
  return [
    new DefinePlugin({
      'process.env.FLAT_SERVE_MODE': JSON.stringify(serveMode),
      'process.env.FLAT_BUILD_DATE': JSON.stringify(new Date().toISOString()),
      ...(rspack.plugins?.definePlugin?.variables || {}),
    }),
  ];
};
