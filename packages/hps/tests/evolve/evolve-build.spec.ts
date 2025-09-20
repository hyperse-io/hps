import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import { cli } from '../../src/index.js';
import { createTestLoadConfig } from '../create-test-load-config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicCwd = join(projectCwd, 'public');

describe('test build evolve modules', async () => {
  beforeAll(async () => {
    if (existsSync(publicCwd)) {
      rmSync(publicCwd, { recursive: true, force: true });
    }
  });

  it('test build evolve modules', async () => {
    cli.use(createTestLoadConfig());
    await cli.parse([
      'build',
      'evolve',
      '--projectCwd',
      projectCwd,
      '--modules',
      'home',
      '--modules',
      'mine',
    ]);

    const assets = fileWalkSync(['**/*.*'], {
      cwd: publicCwd,
    });
    const htmlAssets = assets.filter((asset) => asset.endsWith('.html'));
    const jsAssets = assets.filter((asset) => asset.endsWith('.js'));
    const cssAssets = assets.filter((asset) => asset.endsWith('.css'));
    expect(htmlAssets.length).toBe(2);
    expect(jsAssets.length).toBe(2);
    expect(cssAssets.length).toBe(2);
  });
});
