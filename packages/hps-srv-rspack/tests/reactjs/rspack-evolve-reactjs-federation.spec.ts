import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicCwd = join(projectCwd, 'public/hps/evolve');
const modules = ['federation-home', 'federation-mine'];
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

  it('Should correct support webpack federation', async () => {
    await doBuild(
      modules,
      {
        'federation-home': {
          entry: ['./src/federation-home/index.tsx'],
          options: {
            moduleFederation: {
              exposes: {
                './Widget': {
                  import: './src/federation-home/widget.tsx',
                  // will be auto generated `hps/evolve/federation-home/exposed-micro-module-federation-home-widget`
                  name: `exposed-micro-module-federation-home-widget`,
                },
              },
            },
          },
        },
        'federation-mine': {
          entry: ['./src/federation-mine/index.tsx'],
          options: {
            moduleFederation: {
              remotes: [
                {
                  // will be gereated unique module name `hps_evolve_federation-home` (hps/evolve/federation-home) ref to `federation-home` module
                  name: `federation_home`,
                },
              ],
            },
            htmlMinify: false,
          },
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );
    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/federation-mine/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('window.evolveFetchMicroWidgets = function ()');

    // Make sure home module has exposed module `micro-remote-module.js`
    expect(
      existsSync(
        join(
          projectCwd,
          'public/hps/evolve/federation-home/micro-remote-module.js'
        )
      )
    ).toBe(true);

    const assets = fileWalkSync(['public/hps/evolve/federation-home/*.js'], {
      cwd: projectCwd,
    });

    expect(
      assets.find(
        (s) => !!~s.indexOf('exposed-micro-module-federation-home-widget')
      )
    ).toBeDefined();

    // Make sure that `federation-mine` module has federation-home remote module reference.
    const mineJs = fileWalkSync(['public/hps/evolve/federation-mine/*.js'], {
      cwd: projectCwd,
    });
    const mineJsData = readFileSync(mineJs[0] || '', 'utf-8');
    expect(mineJsData).toMatch(
      'window.evolveFetchMicroWidgets() + "/hps/evolve/federation_home/micro-remote-module.js'
    );
  });
});
