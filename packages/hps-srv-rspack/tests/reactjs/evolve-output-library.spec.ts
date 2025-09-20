import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { mergeOptions } from '@hyperse/hps-srv-common';
import type { EvolveEntryMap } from '../../src/types/types-entry-map.js';
import type { HpsEvolveOptions } from '../../src/types/types-options.js';
import { startTestBuild } from '../test-utils.js';
import { hpsEvolveConfig } from './hps-evolve.config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

describe('evolve reactjs output library', () => {
  const doBuild = async (
    modulePattern: string[],
    buildEntries: DeepPartial<EvolveEntryMap>,
    evolveOptions: DeepPartial<HpsEvolveOptions> = {}
  ) => {
    return await startTestBuild(
      projectCwd,
      modulePattern,
      mergeOptions(hpsEvolveConfig, {
        ...evolveOptions,
        entryMap: buildEntries,
      })
    );
  };

  it('The project build `library` with output library', async () => {
    await doBuild(
      ['library'],
      {
        library: {
          entry: ['./src/library/index.tsx'],
          options: {
            output: {
              library: {
                name: 'FOO',
                type: 'var',
              },
              libraryTarget: 'window',
            },
          },
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/library/*.*'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(3);

    const jsAssets = assets.filter((asset) => asset.endsWith('.js'));
    const cssAssets = assets.filter((asset) => asset.endsWith('.css'));

    expect(jsAssets.length).toBe(2);
    expect(cssAssets.length).toBe(1);
  });
});
