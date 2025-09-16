import { getDirname } from '@armit/file-utility';
import { assertGroupEntryItem } from '../../src/helpers/helper-assert-group-entry-item.js';
import { loadEvolveConfig } from '../../src/load-config/load-evolve-config.js';

const testCwd = getDirname(import.meta.url, 'fixtures');

const evolveOptions = await loadEvolveConfig(testCwd, {
  entryMap: {
    other: {
      entry: ['src/other/index.tsx'],
    },
  },
  projectVirtualPath: 'virtual/path',
});

describe('@hyperse/hps-srv-rspack assert-only-single-entry-item', () => {
  it('should correct extract single entry item', () => {
    const singleEntry = assertGroupEntryItem(
      evolveOptions.entryMap,
      evolveOptions
    )[0];
    expect(singleEntry).toBeDefined();
    expect(Array.isArray(singleEntry)).toBe(true);
    expect(singleEntry[0]).toBe('virtual/path/other');
    expect(singleEntry[1]).toMatchObject({
      entry: ['src/other/index.tsx'],
    });
    expect(singleEntry[1].options).toBeUndefined();
  });
});
