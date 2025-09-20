import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { normalizeResolveAlias } from '../../src/helpers/helper-normalize-resolve-alias.js';

describe('@hyperse/hps-srv-rspack normalize resolve alias', () => {
  const fixtureCwd = getDirname(import.meta.url, 'fixtures');
  it('should correct search current package root dir', async () => {
    const tests: Array<Record<string, string>> = [
      {
        '@': './src',
      },
      {
        '@shared': './src',
      },
      {
        '@/sharedRelative': join(fixtureCwd, './src'),
      },
      {
        '@/sharedAbsolute': join(fixtureCwd, './src'),
      },
      {
        '@/libRelative': './src',
      },
      {
        '@/libAbsolute': join(fixtureCwd, './src'),
      },
    ];

    const results: Array<Record<string, string>> = [
      {
        '@': join(fixtureCwd, './src'),
      },
      {
        '@shared': join(fixtureCwd, './src'),
      },
      {
        '@/sharedRelative': join(fixtureCwd, './src'),
      },
      {
        '@/sharedAbsolute': join(fixtureCwd, './src'),
      },
      {
        '@/libRelative': join(fixtureCwd, './src'),
      },
      {
        '@/libAbsolute': join(fixtureCwd, './src'),
      },
    ];

    for (let index = 0; index < tests.length; index++) {
      const alias = tests[index];
      const newAlias = normalizeResolveAlias(fixtureCwd, alias);
      expect(newAlias).toEqual(results[index]);
    }
  });
});
