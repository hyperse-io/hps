import fg from 'fast-glob';
import { existsSync } from 'node:fs';
import { posix } from 'node:path';
import { logger } from '@hyperse/hps-srv-common';
import { normalizeEntryModuleAbsolutePath } from '../helpers/helper-normalize-entry-module-absolute-path.js';
import type { HpsEvolveDevServerOptions } from '../types/types-dev-server.js';
import type { EvolveEntryMap } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';
/**
 * Loads the watch options for rspack configuration.
 *
 * @param groupEntryMap - The map of entry.
 * @param evolveOptions - The options for the evolve process.
 * @param originalOptions - The original watch options to be merged with.
 * @returns The updated watch options for rspack configuration.
 */
export const loadRspackWatchOptions = (
  groupEntryMap: EvolveEntryMap,
  evolveOptions: HpsEvolveOptions,
  originalOptions: HpsEvolveDevServerOptions['watchOptions'] = {}
): HpsEvolveDevServerOptions['watchOptions'] => {
  const { ignored = [] } = originalOptions;
  const { entryMap: allEntryMap } = evolveOptions;

  const groupEntryModulePaths = normalizeEntryModuleAbsolutePath(
    evolveOptions,
    groupEntryMap
  );

  const allEntryModulePaths = normalizeEntryModuleAbsolutePath(
    evolveOptions,
    allEntryMap
  );

  for (const entryModulePath of allEntryModulePaths) {
    if (!existsSync(entryModulePath)) {
      logger.warn(`The module path does not exist. Check ${entryModulePath}`);
    }

    const index = groupEntryModulePaths.findIndex((groupEntryModulePath) => {
      return groupEntryModulePath === entryModulePath;
    });

    if (index < 0) {
      ignored.push(
        posix.join('**', fg.convertPathToPattern(entryModulePath), '**/*')
      );
    }
  }

  return {
    ...originalOptions,
    ignored,
  };
};
