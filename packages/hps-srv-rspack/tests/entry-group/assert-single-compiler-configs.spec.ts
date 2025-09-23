import type { Configuration, RspackOptions } from '@rspack/core';
import { assertSingleCompiler } from '../../src/helpers/helper-assert-single-compiler.js';
import { type EvolveEntryMap, type HpsEvolveOptions } from '../../src/index.js';

describe('split-to-multi-compiler-configs', () => {
  it('should split to multi compiler configs : use webpack', async () => {
    const servedEntries: EvolveEntryMap = {
      home: {
        entry: ['./src/home/index.ts'],
        groupName: 'home',
      },
      mine: {
        entry: ['./src/mine/index.ts'],
        groupName: 'home',
      },
    };
    const rspackConfig: Omit<Configuration, 'entry'> = {
      devServer: {
        port: 3000,
        host: 'localhost',
      },
    };
    const evolveOptions: HpsEvolveOptions = {
      projectCwd: process.cwd(),
      projectVirtualPath: '/',
      devServer: {},
      rspack: {
        loader: {},
        plugins: {
          multiHtmlPlugin: {
            htmlCdn: '',
          },
        },
      },
      entryMap: {},
    };

    const result = assertSingleCompiler(
      servedEntries,
      rspackConfig,
      evolveOptions,
      true
    );

    expect(result).toBeDefined();
    expect(result.devServer?.port).toBe(3000);
    expect(result.devServer?.host).toBe('localhost');
    expect(result.entry).toHaveProperty('home');
    expect(result.entry).toHaveProperty('mine');
    expect(result.entry).toHaveProperty('home/reactRefreshSetup');
    expect(result.entry).toHaveProperty('mine/reactRefreshSetup');
    expect(result.entry?.['home']).toBe(servedEntries.home.entry);
    expect(result.entry?.['mine']).toBe(servedEntries.mine.entry);
    expect(result.name).toBe('home');
  });

  it('should split to multi compiler configs : use rspack', async () => {
    const servedEntries: EvolveEntryMap = {
      home: {
        entry: ['./src/home/index.ts'],
        groupName: 'home',
      },
      mine: {
        entry: ['./src/mine/index.ts'],
        groupName: 'home',
      },
    };
    const rspackConfig: Omit<RspackOptions, 'entry'> = {
      devServer: {
        port: 3000,
        host: 'localhost',
      },
    };
    const evolveOptions: HpsEvolveOptions = {
      projectCwd: process.cwd(),
      projectVirtualPath: '/',
      devServer: {},
      rspack: {
        loader: {},
        plugins: {
          multiHtmlPlugin: {
            htmlCdn: '',
          },
        },
      },
      entryMap: {},
    };

    const result = assertSingleCompiler(
      servedEntries,
      rspackConfig,
      evolveOptions,
      true
    );

    expect(result).toBeDefined();
    expect(result.devServer?.port).toBe(3000);
    expect(result.devServer?.host).toBe('localhost');
    expect(result.entry).toHaveProperty('home');
    expect(result.entry).toHaveProperty('mine');
    expect(result.entry).toHaveProperty('home/reactRefreshSetup');
    expect(result.entry).toHaveProperty('mine/reactRefreshSetup');
    expect(result.entry?.['home']).toBe(servedEntries.home.entry);
    expect(result.entry?.['mine']).toBe(servedEntries.mine.entry);
    expect(result.name).toBe('home');
  });
});
