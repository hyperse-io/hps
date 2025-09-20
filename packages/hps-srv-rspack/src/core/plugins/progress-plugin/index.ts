import { Worker } from 'node:worker_threads';
import { resolve } from 'path';
import { getDirname } from '@armit/file-utility';
import { mergeOptions } from '@hyperse/config-loader';
import type { Plugin as RspackPlugin } from '@rspack/core';
import { type Compiler } from '@rspack/core';
import { ProgressPlugin, type ProgressPluginArgument } from '@rspack/core';
import type { EntryMapItem } from '../../../types/types-entry-map.js';
import { progressHandler } from './progress-handler.js';

export const createProgressPlugins = (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  pluginOptions: ProgressPluginArgument = {}
): RspackPlugin[] => {
  if (serveMode) {
    return [];
  }

  // FIXME: Is safe to remove `worker thread` while `test` environment, cause of we need to run UT using `source code`
  const isTestEnv = process.env.NODE_ENV === 'test';
  if (isTestEnv) {
    console.warn(`[WARNING] Using fake thread pool worker for unittest!`);
    return [new ProgressPlugin({ prefix: '[ evolve vite progress ]' })];
  }

  const workerPath = resolve(
    getDirname(import.meta.url),
    './progress-worker.js'
  );
  const worker = new Worker(workerPath, {
    env: {
      ...process.env,
      FORCE_COLOR: '3',
    },
  });

  const finalOptions = mergeOptions<ProgressPluginArgument>(
    progressHandler(worker, entryMapItemList),
    pluginOptions
  );

  return [
    new ProgressPlugin(finalOptions),
    {
      apply(compiler: Compiler) {
        compiler.hooks.done.tap('shutdown', () => {
          worker.terminate();
        });
      },
    },
  ];
};
