import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import type { Plugins } from '@rspack/core';
import type { HpsEvolveOptions } from '../../../types/types-options.js';

/**
 * Create the rsdoctor plugin
 * @param evolveOptions
 * @returns
 */
export const createRsdoctorPlugins = (
  evolveOptions: HpsEvolveOptions
): Plugins => {
  const { rspack } = evolveOptions;
  if (!rspack?.plugins?.rsdoctorPlugin?.enabled) {
    return [];
  }
  return [new RsdoctorRspackPlugin({})];
};
