import { resolve } from 'path';
import { ensureSlash, getDirname } from '@armit/file-utility';
import { loadRspackWatchOptions } from '../../src/core/load-rspack-watch-options.js';
import { normalizeEntryModuleAbsolutePath } from '../../src/helpers/helper-normalize-entry-module-absolute-path.js';
import type { EvolveEntryMap } from '../../src/index.js';
import { type HpsEvolveOptions } from '../../src/index.js';

describe('normalize-entry-absolute-path.spec', () => {
  const projectCwd = getDirname(import.meta.url, 'fixtures');

  const evolveOptions: HpsEvolveOptions = {
    projectCwd: projectCwd,
    projectVirtualPath: '/',
    devServer: {},
    loaderOptions: {},
    htmlCdn: '',
    entryMap: {},
  };

  const evolveEntryMap: EvolveEntryMap = {
    home: {
      entry: ['./src/home/index.tsx'],
    },
    mine: {
      entry: ['./src/mine/index.tsx'],
    },
    mine2: {
      entry: ['./src/mine/index.tsx'],
    },
    custom: {
      entry: ['./src/custom'],
    },
    category: {
      entry: ['./src/category/index.tsx'],
      entryModuleBase: ['./pages/category'],
    },
    setting: {
      entry: ['./src/setting/index.tsx'],
      entryModuleBase: ['./module/setting'],
    },
    setting2: {
      entry: ['./src/setting2/index.tsx'],
      entryModuleBase: ['./module/setting'],
    },
    order: {
      entry: ['./src/order/index'],
    },
    about: {
      entry: ['./src/about/index/index/index'],
    },
  };

  it('entry absolute path', async () => {
    const result = normalizeEntryModuleAbsolutePath(
      evolveOptions,
      evolveEntryMap
    );

    expect(result).toBeDefined();
    expect(result.length).toBe(7);
    expect(result).toMatchObject([
      ensureSlash(resolve(evolveOptions.projectCwd, './src/home'), true),
      ensureSlash(resolve(evolveOptions.projectCwd, './src/mine'), true),
      ensureSlash(resolve(evolveOptions.projectCwd, './src/custom'), true),
      ensureSlash(resolve(evolveOptions.projectCwd, './pages/category'), true),
      ensureSlash(resolve(evolveOptions.projectCwd, './module/setting'), true),
      ensureSlash(resolve(evolveOptions.projectCwd, './src/order'), true),
      ensureSlash(
        resolve(evolveOptions.projectCwd, './src/about/index/index'),
        true
      ),
    ]);
  });

  it('load watch options', async () => {
    evolveOptions.entryMap = {
      ...evolveEntryMap,
      a: {
        entry: ['./src/a/index.ts'],
      },
      b: {
        entry: ['./src/b/index.ts'],
      },
      c: {
        entry: ['./src/c/index.ts'],
      },
    };

    const watchOptions = loadRspackWatchOptions(evolveEntryMap, evolveOptions, {
      ignored: ['**/node_modules/**/*'],
    });
    expect(watchOptions).toBeDefined();
    expect(watchOptions?.ignored).toMatchObject([
      '**/node_modules/**/*',
      `**${ensureSlash(resolve(evolveOptions.projectCwd, './src/a'), true)}**/*`,
      `**${ensureSlash(resolve(evolveOptions.projectCwd, './src/b'), true)}**/*`,
      `**${ensureSlash(resolve(evolveOptions.projectCwd, './src/c'), true)}**/*`,
    ]);
  });
});
