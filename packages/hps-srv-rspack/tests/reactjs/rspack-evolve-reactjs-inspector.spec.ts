import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');

describe('evolve reactjs inspector smoking test', () => {
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

  it('The project build `inspector-page` with inspector client', async () => {
    await doBuild(
      ['inspector-page'],
      {
        'inspector-page': {
          entry: ['./src/inspector-page/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
          mode: 'development',
        },
        inspector: {
          injectClient: true,
        },
      }
    );

    const scripts = fileWalkSync(['public/hps/evolve/inspector-page/*.js'], {
      cwd: projectCwd,
    });
    expect(scripts.length).toBe(1);
    const bundleJs = scripts[0];
    expect(bundleJs).toBeDefined();
    const bundleJsData = readFileSync(bundleJs, 'utf-8');
    expect(bundleJsData).toContain('inspector-root');
  });

  it('The project build `inspector-page` with production mode and without inspector client', async () => {
    await doBuild(
      ['inspector-page'],
      {
        'inspector-page': {
          entry: ['./src/inspector-page/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
          mode: 'production',
        },
        inspector: {
          injectClient: true,
        },
      }
    );

    const scripts = fileWalkSync(['public/hps/evolve/inspector-page/*.js'], {
      cwd: projectCwd,
    });
    expect(scripts.length).toBe(1);
    const bundleJs = scripts[0];
    expect(bundleJs).toBeDefined();
    const bundleJsData = readFileSync(bundleJs, 'utf-8');
    expect(bundleJsData).not.toContain('inspector-root');
  });

  it('The project build `inspector-page` with development mode and without inspector client', async () => {
    await doBuild(
      ['inspector-page'],
      {
        'inspector-page': {
          entry: ['./src/inspector-page/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
          mode: 'development',
        },
        inspector: {
          injectClient: false,
        },
      }
    );

    const scripts = fileWalkSync(['public/hps/evolve/inspector-page/*.js'], {
      cwd: projectCwd,
    });
    expect(scripts.length).toBe(1);
    const bundleJs = scripts[0];
    expect(bundleJs).toBeDefined();
    const bundleJsData = readFileSync(bundleJs, 'utf-8');
    expect(bundleJsData).not.toContain('inspector-root');
  });
});
