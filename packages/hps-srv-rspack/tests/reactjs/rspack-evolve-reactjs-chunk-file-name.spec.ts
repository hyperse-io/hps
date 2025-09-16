import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { createConfigLoaderOptions } from '@hyperse/hps-srv-testing';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../src/types/types-options.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');
const publicCwd = join(projectCwd, 'public/hps/evolve');
const modules = ['provider'];
const configLoaderOptions = await createConfigLoaderOptions(
  tsconfig,
  'hps-evolve',
  []
);

describe('evolve reactjs dynamic chunk filename', () => {
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

  beforeAll(async () => {
    for (const module of modules) {
      const moduleAbsPath = join(publicCwd, module);
      if (existsSync(moduleAbsPath)) {
        rmSync(moduleAbsPath, { recursive: true, force: true });
      }
    }
  });

  it('The correct generate dynamic webpack chunk file name', async () => {
    await doBuild(
      modules,
      {
        provider: {
          entry: ['./src/provider/index.tsx'],
        },
      },
      {
        rspack: {
          chunkFileVirtualPath: 'runtime-chunks',
        },
      }
    );

    const assets = fileWalkSync(
      ['public/runtime-chunks/hps/evolve/provider/chunks.*'],
      {
        cwd: projectCwd,
      }
    );
    expect(assets.length).toBe(2);

    const jsAssets = assets.filter((asset) => asset.endsWith('.js'));
    const cssAssets = assets.filter((asset) => asset.endsWith('.css'));

    expect(jsAssets.length).toBe(1);
    expect(cssAssets.length).toBe(1);
  });
});
