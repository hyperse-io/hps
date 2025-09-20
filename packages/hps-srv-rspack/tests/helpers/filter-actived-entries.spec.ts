import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import {
  filterActivedEntriesByEntryInputs,
  filterActivedEntriesByModule,
} from '../../src/helpers/helper-filter-actived-entries.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';

describe('@hyperse/hps-srv-rspack filter-actived-entries', () => {
  const projectCwd = getDirname(import.meta.url, 'fixtures');

  const entryMap: EvolveEntryMap = {
    home: {
      entry: ['./src/home/index.tsx', './src/home/module1'],
    },
    mine: {
      entry: ['./src/mine/index', './src/mine/module2.ts'],
    },
  };

  const entryMap404: EvolveEntryMap = {
    404: {
      entry: ['./src/home/index.tsx', './src/home/module1'],
    },
  };

  it('should correct filter active entries by entry name pattern', async () => {
    const result = await filterActivedEntriesByModule(entryMap, [
      'home',
      'mine',
    ]);
    expect(result).toEqual(entryMap);
  });

  it('should correct handle entry name pattern with number module', async () => {
    const result = await filterActivedEntriesByModule(entryMap404, [
      404 as any,
    ]);
    expect(result).toEqual(entryMap404);
  });

  it('should correct filter active entries by absolute entry input filepaath', async () => {
    const result = await filterActivedEntriesByEntryInputs(
      projectCwd,
      entryMap,
      [
        join(projectCwd, 'src/mine/index'),
        join(projectCwd, 'src/mine/module2.ts'),
      ]
    );
    expect(result).toEqual({
      mine: {
        entry: ['./src/mine/index', './src/mine/module2.ts'],
      },
    });
    expect(result).not.toEqual(entryMap);
  });
});
