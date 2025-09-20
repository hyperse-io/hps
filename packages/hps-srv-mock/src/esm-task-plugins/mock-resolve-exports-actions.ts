import _ from 'lodash';
import { rmSync } from 'node:fs';
import { dirname, posix, resolve } from 'node:path';
import { type Plugin } from 'rollup';
import { fileWalk } from '@armit/file-utility';
import { logger, normalizePlatformPath } from '@hyperse/hps-srv-common';
import { type ExportedActionCacheManager } from '../esm-task/action-cache-manager.js';

export type MockResolveExportsActionsOptions = {
  /**
   * The watch task id
   */
  watcherId: string;
  projectCwd: string;
  actionCacheManager: ExportedActionCacheManager;
};

const pluginName = 'mockResolveExportsActions';

/**
 * This plugin only works `@hyperse/hps-srv-mock`, used to resolve all mock exports `actions`
 * @param pluginOptions
 */
export const mockResolveExportsActions = ({
  watcherId,
  projectCwd,
  actionCacheManager,
}: MockResolveExportsActionsOptions): Plugin => {
  const flushActionTask = _.debounce(
    actionCacheManager.flush.bind(actionCacheManager),
    250,
    {
      maxWait: 1000,
    }
  );

  const pluginDefine: Plugin = {
    name: pluginName,
    generateBundle: {
      order: 'post',
      async handler(options, bundle) {
        const outputDir = options.dir || '';
        // clear oldest bundle files based on new entry bundle.
        for (const [entryName, entryOption] of Object.entries(bundle)) {
          if (entryOption.type === 'chunk' && entryOption.isEntry === true) {
            const entryBundleFile = normalizePlatformPath(
              resolve(outputDir, entryOption.fileName)
            );
            const entryAbsBaseDir = dirname(entryBundleFile);
            const existedBundleFiles = await fileWalk(
              posix.join(entryAbsBaseDir, '**', '*.mjs')
            );
            if (!existedBundleFiles.includes(entryBundleFile)) {
              if (entryOption.facadeModuleId) {
                // stale mock file cause of entry has been changed.
                actionCacheManager.staleMockFile(
                  watcherId,
                  entryOption.facadeModuleId,
                  entryBundleFile,
                  projectCwd
                );
              } else {
                logger.warn(
                  `No facadeModuleId found for bundle "${entryName}"`
                );
              }
            }
            if (existedBundleFiles.length) {
              // clear all bundle histories for current `entry point`
              logger.debug(
                `Clear existed bundle files of entry dir("${dirname(
                  entryOption.fileName
                )}")`
              );
              // clean
              rmSync(entryAbsBaseDir, {
                force: true,
                recursive: true,
              });
            }
          }
        }
      },
    },
    writeBundle: {
      order: 'post',
      handler() {
        // Called only at the end of bundle.write() once all files have been written.
        flushActionTask(watcherId, projectCwd);
      },
    },
    renderError: {
      order: 'post',
      handler(error) {
        if (error) {
          logger.error(error);
        }
        flushActionTask(watcherId, projectCwd);
      },
    },
  };
  return pluginDefine;
};
