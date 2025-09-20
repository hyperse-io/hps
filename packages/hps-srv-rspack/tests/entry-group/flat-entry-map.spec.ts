import { flatEntryMap } from '../../src/helpers/helper-flat-entry-map.js';
import type { EvolveDevServerEntryMap } from '../../src/types/types-dev-server.js';

describe('flat-entry-map.spec', () => {
  it('flat entry map', async () => {
    const groupEntryMapList: EvolveDevServerEntryMap[] = [
      {
        home: {
          entryConfig: {
            entry: ['./src/home/index.ts'],
            groupName: 'flat/evolve/pages/dev',
          },
          devServerPort: 8081,
          devServerHostUri: '0.0.0.0',
          normalizedEntryName: 'flat/evolve/pages/home',
        },
        mine: {
          entryConfig: {
            entry: ['./src/mine/index.ts'],
            groupName: 'flat/evolve/pages/dev',
          },
          devServerPort: 8081,
          devServerHostUri: '0.0.0.0',
          normalizedEntryName: 'flat/evolve/pages/mine',
        },
      },
      {
        setting: {
          entryConfig: {
            entry: ['./src/setting/index.ts'],
            groupName: 'flat/evolve/pages/dev',
          },
          devServerPort: 8082,
          devServerHostUri: '0.0.0.0',
          normalizedEntryName: 'flat/evolve/pages/setting',
        },
      },
    ];
    const result = flatEntryMap(groupEntryMapList);
    expect(Object.keys(result)).toHaveLength(3);
  });
});
