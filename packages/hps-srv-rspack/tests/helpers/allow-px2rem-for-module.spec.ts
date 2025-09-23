import { getDirname } from '@armit/file-utility';
import { allowPx2remForModule } from '../../src/helpers/helper-allow-px2rem-for-module.js';
import { assertGroupEntryItem } from '../../src/helpers/helper-assert-group-entry-item.js';
import { loadEvolveConfig } from '../../src/load-config/load-evolve-config.js';

const testCwd = getDirname(import.meta.url, 'fixtures');
let evolveOptions = await loadEvolveConfig(testCwd, {
  entryMap: {
    home: {
      entry: ['src/home/index.tsx'],
      options: {
        allowPx2rem: true,
      },
    },
  },
});

describe('@hyperse/hps-srv-rspack allow-px2rem-for-module', () => {
  it('should correct check if px2rem available', () => {
    const singleEntry = assertGroupEntryItem(
      evolveOptions.entryMap,
      evolveOptions
    )[0];
    expect(allowPx2remForModule(undefined, evolveOptions)).toBe(true);
    expect(allowPx2remForModule(undefined, undefined)).toBe(false);
    expect(allowPx2remForModule(singleEntry, undefined)).toBe(true);
  });

  it('should correct check if px2rem available from entry item options', async () => {
    evolveOptions = await loadEvolveConfig(testCwd, {
      entryMap: {
        home: {
          entry: ['src/home/index.tsx'],
          options: {
            allowPx2rem: false,
          },
        },
      },
    });
    let singleEntry = assertGroupEntryItem(
      evolveOptions.entryMap,
      evolveOptions
    )[0];
    expect(allowPx2remForModule(undefined, evolveOptions)).toBe(true);
    expect(allowPx2remForModule(undefined, undefined)).toBe(false);
    expect(allowPx2remForModule(singleEntry, undefined)).toBe(false);

    evolveOptions = await loadEvolveConfig(testCwd, {
      rspack: {
        loader: {
          pixelOptions: false,
        },
      },
      entryMap: {
        home: {
          entry: ['src/home/index.tsx'],
          options: {
            allowPx2rem: true,
          },
        },
      },
    });
    singleEntry = assertGroupEntryItem(
      evolveOptions.entryMap,
      evolveOptions
    )[0];
    expect(allowPx2remForModule(undefined, evolveOptions)).toBe(false);
    expect(allowPx2remForModule(singleEntry, evolveOptions)).toBe(true);
  });
});
