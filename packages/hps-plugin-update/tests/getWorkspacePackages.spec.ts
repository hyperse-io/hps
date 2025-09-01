import { join } from 'node:path';
import { getWorkspacePackages } from '../src/utils/getWorkspacePackages.js';
import { getDirname } from './test-utils.js';

describe('getWorkspacePackages()', () => {
  const fixtureCwd = getDirname(import.meta.url, 'fixtures');
  it('Should correct resolve workspace packages', async () => {
    const packages = await getWorkspacePackages(join(fixtureCwd, 'mono'));
    for (const [dir, meta] of packages) {
      expect(dir).toBeDefined();
      expect({
        meta,
      }).toMatchSnapshot();
    }
  });

  it('Should correct normalize single normal project', async () => {
    const packages = await getWorkspacePackages(
      join(fixtureCwd, 'mono/website')
    );
    for (const [dir, meta] of packages) {
      expect(dir).toBeDefined();
      expect({
        meta,
      }).toMatchSnapshot();
    }
  });

  it('Should correct resolve workspace packages for single repo', async () => {
    const packages = await getWorkspacePackages(join(fixtureCwd, 'single'));
    for (const [dir, meta] of packages) {
      expect(dir).toBeDefined();
      expect({
        meta,
      }).toMatchSnapshot();
    }
  });
});
