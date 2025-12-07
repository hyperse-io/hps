import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import { testCli } from '../test-cli.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicCwd = join(projectCwd, 'public');

describe('test build evolve modules', async () => {
  beforeAll(async () => {
    if (existsSync(publicCwd)) {
      rmSync(publicCwd, { recursive: true, force: true });
    }
  });

  it('test build evolve modules', async () => {
    await testCli.parse([
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

  it('test build evolve modules with mode development', async () => {
    await testCli.parse([
      'build',
      'evolve',
      '--projectCwd',
      projectCwd,
      '--modules',
      'home',
      '--mode',
      'development',
    ]);
    const assets = fileWalkSync(['**/*.js'], {
      cwd: publicCwd,
    });

    const homeBundleJs = assets.find((asset) =>
      asset.includes('/hps/evolve/home/')
    );
    expect(homeBundleJs).toBeDefined();
    const targetStr = [
      'react.development.js',
      'react-jsx-runtime.development.js',
    ];
    const homeBundleJsData = readFileSync(homeBundleJs || '', 'utf-8');
    for (const str of targetStr) {
      expect(homeBundleJsData).toContain(str);
    }
  });

  it('test build evolve modules with mode production', async () => {
    await testCli.parse([
      'build',
      'evolve',
      '--projectCwd',
      projectCwd,
      '--modules',
      'home',
      '--mode',
      'production',
    ]);
    const assets = fileWalkSync(['**/*.js'], {
      cwd: publicCwd,
    });

    const homeBundleJs = assets.find((asset) =>
      asset.includes('/hps/evolve/home/')
    );
    expect(homeBundleJs).toBeDefined();
    const targetStr = [
      'react.production.js',
      'react-jsx-runtime.production.js',
    ];
    const homeBundleJsData = readFileSync(homeBundleJs || '', 'utf-8');
    for (const str of targetStr) {
      expect(homeBundleJsData).toContain(str);
    }
  });

  it('test build evolve modules with mode none', async () => {
    await testCli.parse([
      'build',
      'evolve',
      '--projectCwd',
      projectCwd,
      '--modules',
      'home',
    ]);
    const assets = fileWalkSync(['**/*.js'], {
      cwd: publicCwd,
    });

    const homeBundleJs = assets.find((asset) =>
      asset.includes('/hps/evolve/home/')
    );
    expect(homeBundleJs).toBeDefined();
    const targetStr = [
      'react.production.js',
      'react-jsx-runtime.production.js',
    ];
    const homeBundleJsData = readFileSync(homeBundleJs || '', 'utf-8');
    for (const str of targetStr) {
      expect(homeBundleJsData).toContain(str);
    }
  });
});
