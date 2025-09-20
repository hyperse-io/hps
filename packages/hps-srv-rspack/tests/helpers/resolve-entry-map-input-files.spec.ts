import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { resolveEntryMapInputFiles } from '../../src/helpers/helper-resolve-entry-map-input-files.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';

describe('@hyperse/hps-srv-rspack resolve-entry-map-input-files', () => {
  const projectCwd = getDirname(import.meta.url, 'fixtures');

  it('should correct resolve entry Map into absolute file path', async () => {
    const entryMap: EvolveEntryMap = {
      home: {
        entry: ['./src/home/index.tsx', './src/home/module1'],
      },
      mine: {
        entry: ['./src/mine/index', './src/mine/module2.ts'],
      },
    };
    const result = await resolveEntryMapInputFiles(projectCwd, entryMap);

    expect(result).toEqual([
      join(projectCwd, `src/home/index.ts`),
      join(projectCwd, `src/home/module1.ts`),
      join(projectCwd, `src/mine/index.tsx`),
      join(projectCwd, `src/mine/module2.ts`),
    ]);
  });
});
