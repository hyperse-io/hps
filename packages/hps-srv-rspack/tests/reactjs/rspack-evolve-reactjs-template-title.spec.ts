import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicPath = join(projectCwd, 'public');
const tsconfig = join(projectCwd, '../../../tsconfig.json');

describe('evolve reactjs smoking test for each html', () => {
  beforeAll(() => {
    if (existsSync(publicPath)) {
      rmSync(publicPath, { recursive: true });
    }
  });

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

  it('Customize the title during the group building process`', async () => {
    await doBuild(['titleA', 'titleA_child', 'titleB', 'titleB_child'], {
      titleA: {
        entry: ['./src/title-a/index.tsx'],
        options: {
          title: 'evolve-titleA',
        },
      },
      titleA_child: {
        entry: ['./src/title-a/index.tsx'],
        options: {},
      },
      titleB: {
        entry: ['./src/title-b/index.tsx'],
        options: {
          title: 'evolve-titleB',
        },
      },
      titleB_child: {
        entry: ['./src/title-b/index.tsx'],
        options: {
          title: 'evolve-titleB-child',
        },
      },
    });

    const titleAHtmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/titleA/index.html`),
      'utf-8'
    );
    expect(titleAHtmlStr).toMatch('<title>evolve-titleA</title>');

    //title is undefined
    const titleAChildHtmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/titleA_child/index.html`),
      'utf-8'
    );
    expect(titleAChildHtmlStr).not.toMatch('<title>');
    expect(titleAChildHtmlStr).not.toMatch('</title>');

    const titleBCHtmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/titleB/index.html`),
      'utf-8'
    );
    expect(titleBCHtmlStr).toMatch('<title>evolve-titleB</title>');

    // entryName is like `titleB/child`
    const titleBChildHtmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/titleB_child/index.html`),
      'utf-8'
    );
    expect(titleBChildHtmlStr).toMatch('<title>evolve-titleB-child</title>');
  });
});
