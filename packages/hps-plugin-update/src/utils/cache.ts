import os from 'node:os';
import { join } from 'node:path';

/**
 * The home directory
 */
const homeDirectory = os.homedir();

/**
 * The config directory for the ncu cache
 */
const configDir =
  process.env.XDG_CONFIG_HOME ||
  join(homeDirectory, '.config', 'hps-npm-check-update');

/**
 * Get the ncu cache file
 * @param packageName - The name of the package
 * @returns The path to the ncu cache file
 */
export const getNcuCacheFile = (packageName = 'ncu-cache') => {
  return join(configDir, `${packageName}.json`);
};
