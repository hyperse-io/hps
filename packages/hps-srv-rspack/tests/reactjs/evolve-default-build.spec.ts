import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { createConfigLoaderOptions } from '@hyperse/hps-srv-testing';
import type { EvolveEntryMap } from '../../src/types/types-entry-map.js';
import type { HpsEvolveOptions } from '../../src/types/types-options.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');
const configLoaderOptions = await createConfigLoaderOptions(
  tsconfig,
  'hps-evolve',
  ['@hyperse/hps-srv-rspack']
);

describe('evolve reactjs output library', () => {
  const doBuild = async (
    modulePattern: string[],
    buildEntries: DeepPartial<EvolveEntryMap>,
    evolveOptions: DeepPartial<HpsEvolveOptions> = {}
  ) => {
    return await startTestBuild(
      projectCwd,
      modulePattern,
      { ...evolveOptions, entryMap: buildEntries },
      configLoaderOptions
    );
  };

  it('The project build `home` with default build', async () => {
    await doBuild(
      ['home'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
          options: {},
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/flatjs/evolve/home/*.*'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(3);
  });
});
