import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicCwd = join(projectCwd, 'public/hps/evolve');
const modules = ['target-es5'];
const tsconfig = join(projectCwd, '../../../tsconfig.json');
describe('evolve reactjs smoking test for each entry points', () => {
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
  beforeAll(async () => {
    for (const module of modules) {
      const moduleAbsPath = join(publicCwd, module);
      if (existsSync(moduleAbsPath)) {
        rmSync(moduleAbsPath, { recursive: true, force: true });
      }
    }
  });

  it('The project build `home` with target es5', async () => {
    await doBuild(
      ['target-es5'],
      {
        'target-es5': {
          entry: ['./src/target-es5/index.tsx'],
          options: {
            enableBundleHashName: false,
          },
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/target-es5/*.js'], {
      cwd: projectCwd,
    });
    expect(assets.length).toBe(1);
    const bundleContent = readFileSync(assets[0], 'utf-8');
    expect(
      bundleContent.includes(
        'var l = "boolean" == typeof r || null == r ? void 0 : r.behavior'
      )
    ).toBeTruthy();
  });
});
