import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { ensureSlash } from '@hyperse/hps-srv-common';
import { getPackageDir } from '@hyperse/hps-srv-common';

describe('@hyperse/hps-srv-rspack get-pacakge-dir', () => {
  const fixtureCwd = getDirname(import.meta.url, 'fixtures');
  it('should correct search current package root dir', async () => {
    // for serve Model.
    const packageDir = getPackageDir(import.meta.url);
    expect(ensureSlash(packageDir, true)).toBe(join(fixtureCwd, '../../../'));

    // with spread paths
    expect(getPackageDir(import.meta.url, '/name')).toBe(
      join(fixtureCwd, '../../../name')
    );
  });
});
