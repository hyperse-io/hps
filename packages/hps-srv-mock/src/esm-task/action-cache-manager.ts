import { relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { logger, normalizePlatformPath } from '@hyperse/hps-srv-common';
import { normalizeMockExports } from '../helpers/normalize-mock-exports.js';
import { type MockRequestHandler } from '../types/types-options.js';
import { mockChunks } from './mock-chunk.js';

export interface ExportedActionCacheManager {
  staleMockFile(
    watcherId: string,
    mockFile: string,
    bundleModuleId: string,
    projectCwd: string
  ): void;
  queryActionFn(
    watcherId: string,
    mockFile: string
  ): Array<Record<string, MockRequestHandler>>;
  flush(watcherId: string, projectCwd: string): Promise<void>;
}

class ActionCacheManager implements ExportedActionCacheManager {
  private staledMockFilesOfWatchers = new Map<string, Map<string, string>>();

  private exportedServicesOfWatchers = new Map<
    string,
    Map<string, Array<Record<string, any>>>
  >();

  private watcherLoaded = new Map<string, boolean>();

  staleMockFile(
    watcherId: string,
    mockFile: string,
    entryModuleId: string,
    projectCwd: string
  ): void {
    // mockFile: `mocks/module-exports/exports-direct.js?commonjs-entry'`
    mockFile = mockFile.split('?')[0];
    if (this.watcherLoaded.get(watcherId)) {
      logger.debug(`Stale mock: "${relative(projectCwd, mockFile)}"`);
    }
    let staledMockFilesOfWatcher =
      this.staledMockFilesOfWatchers.get(watcherId);

    if (!staledMockFilesOfWatcher) {
      staledMockFilesOfWatcher = new Map<string, string>();
    }

    staledMockFilesOfWatcher.set(
      normalizePlatformPath(mockFile),
      entryModuleId
    );
    this.staledMockFilesOfWatchers.set(watcherId, staledMockFilesOfWatcher);
  }

  queryActionFn(mockFile: string): Array<Record<string, MockRequestHandler>> {
    const watcherId = mockChunks.getChunkIdByDefFile(mockFile);
    if (!watcherId) {
      logger.warn(`No watcher(${watcherId}) found`);
      return [];
    }
    const exportedServicesOfWatcher =
      this.exportedServicesOfWatchers.get(watcherId);

    if (!exportedServicesOfWatcher) {
      logger.warn(`No exported services of watcher(${watcherId}) found `);
      return [];
    }

    return exportedServicesOfWatcher?.get(mockFile) || [];
  }

  async flush(watcherId: string, projectCwd: string): Promise<void> {
    const staledMockFilesOfWatcher =
      this.staledMockFilesOfWatchers.get(watcherId);

    if (!staledMockFilesOfWatcher) {
      logger.warn(`No staled mock files of watcher(${watcherId}) found `);
      return;
    }

    for (const [mockFile, entryModuleId] of staledMockFilesOfWatcher) {
      const relativeEntryModuleId = relative(projectCwd, mockFile);
      if (this.watcherLoaded.get(watcherId)) {
        logger.info(`Load mock "${relativeEntryModuleId}"`);
      }
      const moduleUrl = pathToFileURL(entryModuleId.replace(/.mjs$/, ''));
      const result = await import(`${moduleUrl}.mjs`);

      // normalized mock exports
      const resultData = normalizeMockExports(result.default || result);

      let exportedServicesOfWatcher =
        this.exportedServicesOfWatchers.get(watcherId);

      // cache exported action data on mock entry absolute file path.
      if (!exportedServicesOfWatcher) {
        exportedServicesOfWatcher = new Map<
          string,
          Array<Record<string, any>>
        >();
      }

      // replace the new `mockExports` data
      exportedServicesOfWatcher.set(mockFile, resultData);
      this.exportedServicesOfWatchers.set(watcherId, exportedServicesOfWatcher);
    }

    if (!this.watcherLoaded.get(watcherId)) {
      this.watcherLoaded.set(watcherId, true);
    }
    staledMockFilesOfWatcher.clear();
  }
}

export const actionCacheManager = new ActionCacheManager();
