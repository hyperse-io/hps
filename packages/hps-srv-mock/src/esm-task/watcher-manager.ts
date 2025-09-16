import type { TransformOptions } from 'esbuild';
import Listr from 'listr';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { type ChangeEvent, type Plugin, type RollupWatcher } from 'rollup';
import type { PackageJson } from 'type-fest';
import { createRollupWatcher, type FlatForgeOptions } from '@flatjs/forge';
import { chalk, logger } from '@hyperse/hps-srv-common';
import { esbuildTransform } from '../esm-task-plugins/esbuild.js';
import { mockResolveExportsActions } from '../esm-task-plugins/mock-resolve-exports-actions.js';
import { getMaxProcessTasks } from '../helpers/get-max-process-tasks.js';
import { getMockCwd } from '../helpers/get-mock-cwd.js';
import { getTsconfig } from '../helpers/get-tsconfig.js';
import { loadMockMapDefEntryFiles } from '../helpers/load-mock-map-defs.js';
import { type HpsMockOptions } from '../types/types-options.js';
import { WatchTask } from '../watch/watch-task.js';
import { actionCacheManager } from './action-cache-manager.js';
import { mockChunks } from './mock-chunk.js';
export interface WatcherManagerOptions {
  /**
   * Push into a chunk every 30 files.
   * @default 30
   */
  chunkSize?: number;
  projectCwd: string;
  externalModules: Array<RegExp | string>;
  mockOptions: HpsMockOptions;
  packageJson?: PackageJson;
}

export class WatcherManager {
  private watachers: Map<string, RollupWatcher> = new Map();
  constructor(private options: WatcherManagerOptions) {
    // Default attach watcher on `config files`
    void this.createFileWatcher(this.onWatchFileChanged.bind(this));
    return this;
  }

  /**
   * To start watcher manager server.
   * @param mockEntryFiles
   */
  async start(mockEntryFiles: string[]) {
    await this.addMockEntryFiles(mockEntryFiles, true);
    logger.info('The mock service is ready...');
    return this;
  }

  /**
   * Expose `close` method to close all watchers.
   * e.g. we should correct close watchers when `SIGINT` or `SIGTERM` signal received.
   */
  close() {
    for (const watcher of this.watachers.values()) {
      watcher.close();
    }
  }

  private async addMockEntryFiles(
    mockEntryFiles: string[],
    refresh = false
  ): Promise<void> {
    if (!mockEntryFiles.length) {
      logger.debug(`No mock entry files providered, skip update watcher!`);
      return;
    }
    const { chunkSize = 30 } = this.options;
    const chunkMap = mockChunks.spanMockFilesToChunks(
      mockEntryFiles,
      chunkSize,
      refresh
    );
    const concurrentSize = getMaxProcessTasks(Object.keys(chunkMap).length);

    const watcherTasks = new Listr([], {
      concurrent: concurrentSize,
      exitOnError: true,
    });

    for (const [watcherId, chunkDefFiles] of chunkMap) {
      const watcher = this.watachers.get(watcherId);
      if (!watcher) {
        watcherTasks.add({
          title: `Starting transform job [${chalk(['magenta'])(
            watcherId
          )}] ...`,
          task: () => this.createWatcher(watcherId, chunkDefFiles),
        });
      } else {
        // FIXME: Try to check watchers which has no real `input` files, and free memory.
        const watcherDefFiles = chunkDefFiles.filter((s) => existsSync(s));
        // If watcher has no `input` files providered need to remove it to clean `memory`.
        if (!watcherDefFiles.length) {
          logger.info(
            `Remove transform job [${chalk(['magenta'])(watcherId)}] ...`
          );
          mockChunks.removeMockChunkById(watcherId);
          watcher.removeAllListeners().close();
          this.watachers.delete(watcherId);
        }
      }
    }
    if (watcherTasks.tasks.length) {
      await watcherTasks.run();
    }
  }

  private async onWatchFileChanged(
    type: 'configFile' | 'mockFile',
    data: { id: string; event: ChangeEvent }
  ) {
    const { id, event } = data;
    const { projectCwd, mockOptions } = this.options;
    const relativePath = relative(projectCwd, id);

    logger.info(
      `The file \`${chalk(['magenta'])(relativePath)}\` has been ${event}`
    );
    const allMockDefFiles: string[] = [];

    if (type === 'mockFile') {
      if (event === 'create') {
        allMockDefFiles.push(id);
      }
    } else if (type === 'configFile') {
      const mockDefFiles = await loadMockMapDefEntryFiles(mockOptions);
      allMockDefFiles.push(...mockDefFiles);
    }

    const newMockEntryFiles: string[] = [];
    for (const mockFile of allMockDefFiles) {
      const existedWatcher = mockChunks.getChunkIdByDefFile(mockFile);
      if (!existedWatcher) {
        newMockEntryFiles.push(mockFile);
      }
    }

    this.addMockEntryFiles(newMockEntryFiles, false);
  }

  private async createFileWatcher(
    onFileChanged: (
      type: 'configFile' | 'mockFile',
      data: { id: string; event: ChangeEvent }
    ) => void
  ) {
    const { projectCwd, mockOptions } = this.options;
    const configFile = [
      `hps-mock.config.ts`,
      `hps-mock.config.mts`,
      `hps-mock.config.mjs`,
    ];
    const mockCwd = getMockCwd(mockOptions);
    const watchTask = new WatchTask({
      chokidar: {
        cwd: projectCwd,
      },
      paths: [...configFile, mockCwd],
    });

    watchTask.addEventListener((data) => {
      if (onFileChanged) {
        onFileChanged(
          configFile.includes(data.relativeId) ? 'configFile' : 'mockFile',
          data
        );
      }
    });
  }

  private async createWatcher(watcherId: string, mockDefFiles: string[]) {
    const { packageJson = {}, projectCwd } = this.options;

    // Use project default tsconfig.
    const tsconfig = getTsconfig(projectCwd);

    const esbuildConfig: TransformOptions = {
      target: 'node20',
      tsconfigRaw: tsconfig?.config,
    };

    const watcherOptions = this.createWatcherOptions(watcherId, mockDefFiles, [
      esbuildTransform(esbuildConfig),
      mockResolveExportsActions({
        watcherId,
        projectCwd,
        actionCacheManager,
      }),
    ]);

    const watcher = await createRollupWatcher(watcherOptions, packageJson);
    this.watachers.set(watcherId, watcher);

    return new Promise<void>((resolve) => {
      watcher.on('event', (event: any) => {
        if (
          !watcher['started' as keyof RollupWatcher] &&
          (event.code === 'END' || event.code === 'ERROR')
        ) {
          watcher['started' as keyof RollupWatcher] = true as any;
          resolve();
        }
        if (event.code === 'ERROR') {
          logger.error(event.error);
        }
      });
    });
  }

  private createWatcherOptions(
    watcherId: string,
    mockDefEntryFiles: string[],
    extraPlugins: Plugin[] = []
  ) {
    const { projectCwd, externalModules } = this.options;

    const options: FlatForgeOptions = {
      projectCwd,
      input: mockDefEntryFiles,
      externals: externalModules,
      dts: false,
      plugin: {
        pluginConfigs: {
          terserOptions: false,
          // Disable babel transform to speed up build, Use esbuild instead.
          babelOptions: false,
          nodeResolveOptions: {
            extensions: ['.js', '.ts', '.mjs', '.cjs', '.mts', '.cts', '.json'],
          },
        },
        extraPlugins,
      },
      output: {
        format: 'esm',
        distFolder: join('.cache', watcherId),
        cleanDistFolder: false,
        preserveModules: false,
        entryFileNames: (chunkInfo: any) => {
          // Make sure that we have `mocks/rest/catalog/[hash:16].mjs`.
          return join(chunkInfo.name, '[hash:16].mjs');
        },
      },
    };
    return options;
  }
}
