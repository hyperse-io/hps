import { mergeOptions } from '@hyperse/hps-srv-common';
import type { Configuration } from '@rspack/core';
import type { ForgeTsCheckerOptions } from '../types/type-options.js';

export const createWatchOptions = (
  options: ForgeTsCheckerOptions
): Configuration['watchOptions'] => {
  const { watchOptions = {} } = options;
  const defaultWatchOptions: Configuration['watchOptions'] = {
    poll: 1000,
    // Use array here, easy can add a new ignore dynamic at runtime.
    ignored: ['**/node_modules', '**/mocks', '**/miniprogram'],
    aggregateTimeout: 500,
  };

  return mergeOptions<Configuration['watchOptions']>(
    defaultWatchOptions,
    watchOptions
  );
};
