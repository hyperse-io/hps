import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { mergeOptions } from '@hyperse/hps-srv-common';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';
import { hpsEvolveConfig } from './hps-evolve.config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

describe('evolve reactjs smoking test for each entry points modular', () => {
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

  it('The project build `modular` with shared less assets', async () => {
    await doBuild(
      ['modular'],
      {
        modular: {
          entry: ['./src/modular/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/modular/*.js'], {
      cwd: projectCwd,
    });
    expect(assets.length).toBe(1);
  });
});
