import { join } from 'path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');

describe('evolve reactjs smoking test for each entry points modular', () => {
  const doBuild = async (
    modulePattern: string[],
    buildEntries: DeepPartial<EvolveEntryMap>,
    evolveOptions: DeepPartial<HpsEvolveOptions> = {}
  ) => {
    return await startTestBuild(
      projectCwd,
      modulePattern,
      {
        ...evolveOptions,
        entryMap: buildEntries,
      },
      tsconfig
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

  it('The project build `circularPlugin` with shared less assets', async () => {
    await doBuild(
      ['circular-plugin'],
      {
        'circular-plugin': {
          entry: ['./src/circular-plugin/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/circular-plugin/*.js'], {
      cwd: projectCwd,
    });
    expect(assets.length).toBe(1);
  });
});
