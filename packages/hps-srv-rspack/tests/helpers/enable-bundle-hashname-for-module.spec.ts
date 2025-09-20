import { getDirname } from '@armit/file-utility';
import { assertGroupEntryItem } from '../../src/helpers/helper-assert-group-entry-item.js';
import { enableBundleHashName } from '../../src/helpers/helper-enable-bundle-hashname.js';
import { loadEvolveConfig } from '../../src/load-config/load-evolve-config.js';

const testCwd = getDirname(import.meta.url, 'fixtures');
let evolveOptions = await loadEvolveConfig(testCwd, {
  entryMap: {
    home: {
      entry: ['src/home/index.tsx'],
    },
  },
});

describe('@hyperse/hps-srv-rspack enable-bundle-hashname-for-module', () => {
  it('should correct check bundle hashname status for single entry', async () => {
    let entryItem = assertGroupEntryItem(
      evolveOptions.entryMap,
      evolveOptions
    )[0];
    let enabled = enableBundleHashName(evolveOptions, entryItem[1].options);
    expect(evolveOptions.rspack?.enableBundleHashName).toBe(true);
    expect(enabled).toBe(true);
    // reload evolve config with entry item options.
    evolveOptions = await loadEvolveConfig(testCwd, {
      entryMap: {
        home: {
          entry: ['src/home/index.tsx'],
          options: {
            enableBundleHashName: false,
          },
        },
      },
    });
    expect(evolveOptions.rspack?.enableBundleHashName).toBe(true);
    entryItem = assertGroupEntryItem(evolveOptions.entryMap, evolveOptions)[0];
    expect(evolveOptions.rspack?.enableBundleHashName).toBe(true);
    expect(entryItem[1].options?.enableBundleHashName).toBe(false);
    enabled = enableBundleHashName(evolveOptions, entryItem[1].options);
    expect(enabled).toBe(false);
  });
});
