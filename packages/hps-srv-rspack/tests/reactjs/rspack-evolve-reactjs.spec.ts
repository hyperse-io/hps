import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalkSync, getDirname } from '@armit/file-utility';
import type { DeepPartial } from '@hyperse/config-loader';
import { createConfigLoaderOptions } from '@hyperse/hps-srv-testing';
import { type HpsEvolveOptions } from '../../src/index.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';
import { startTestBuild } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');
const configLoaderOptions = await createConfigLoaderOptions(
  tsconfig,
  'hps-evolve',
  []
);

describe('evolve reactjs smoking test for each entry points', () => {
  const doBuild = async (
    modulePattern: string[],
    buildEntries: DeepPartial<EvolveEntryMap>,
    evolveOptions: DeepPartial<HpsEvolveOptions> = {}
  ) => {
    return await startTestBuild(
      projectCwd,
      modulePattern,
      { ...evolveOptions, entryMap: buildEntries },
      configLoaderOptions
    );
  };

  it('The project build `home` with shared less assets', async () => {
    await doBuild(
      ['home'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
          options: {
            enableBundleHashName: false,
          },
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/home/*.css'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    expect(assets[0]).toMatch(/bundle\.css$/);
    const styleFileData = readFileSync(assets[0] || '', 'utf-8');
    expect(styleFileData).toMatch(
      `https://hps.cdn.domain.com/hps/evolve/shared/icons/logo-6c137b82.png`
    );
    const scripts = fileWalkSync(['public/hps/evolve/home/*.js'], {
      cwd: projectCwd,
    });
    expect(scripts.length).toBe(2);
    const bundleJs = scripts.find((s) => /bundle\.js$/.test(s));
    const chunkJs = scripts.find((s) => /chunks\.js$/.test(s));
    expect(bundleJs).toBeDefined();
    expect(chunkJs).toBeDefined();
  });

  it('The project build `home` with muti cdn plugin', async () => {
    await doBuild(
      ['home'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/home/bundle*.js'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    const boundleJsFileData = readFileSync(assets[0] || '', 'utf-8');
    expect(boundleJsFileData).toMatch(`window.$evolve = window.$evolve || {};`);
  });
  it('The project build with runtime multiCDN config', async () => {
    await doBuild(
      ['home'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
        },
      },
      {
        rspack: {
          minimizer: false,
        },
      }
    );

    const jsAssets = fileWalkSync(['public/hps/evolve/home/*.js'], {
      cwd: projectCwd,
    });
    const bundleJs = jsAssets.find((s) => /bundle.+js$/.test(s));
    const jsFileData = readFileSync(bundleJs || '', 'utf-8');
    expect(jsFileData).toMatch(
      `var runtimeCDNBase = ${JSON.stringify('https://hps.cdn.domain.com')};`
    );
    expect(jsFileData).toMatch('window.$evolve = window.$evolve || {};');
    expect(jsFileData).toMatch(
      'window.$evolve.runtimeCDNBase = runtimeCDNBase;'
    );
    expect(jsFileData).toMatch(
      '__webpack_require__.p = runtimeCDNBase || __webpack_require__.p;'
    );
  });

  it('The project build with nested module', async () => {
    const result = await doBuild(['^child'], {
      child: {
        entry: ['./src/parent/child/index.tsx'],
      },
    });
    expect(result.length).greaterThan(0);
    expect(result[0].name?.[0]).toBe('hps/evolve/child');
    let checkFiles: string[] = ['public/hps/evolve/child/index.html'];

    for (const checkFile of checkFiles) {
      expect(existsSync(join(projectCwd, checkFile))).toBe(true);
    }

    const result2 = await doBuild(['parent/child2'], {
      'parent/child2': {
        entry: ['./src/parent/child2/index.tsx'],
      },
    });
    expect(result2.length).greaterThan(0);
    expect(result2[0].name?.[0]).toBe('hps/evolve/parent/child2');
    checkFiles = ['public/hps/evolve/parent/child2/index.html'];
    for (const checkFile of checkFiles) {
      expect(existsSync(join(projectCwd, checkFile))).toBe(true);
    }

    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/parent/child2/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch(
      `<script id="script/parent/child2/envCdn" src="https://hps.cdn.domain.com"></script>`
    );
  });

  it('The project build with normal configurations', async () => {
    const result = await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          favicon: {
            href: 'base64:favicon',
            rel: 'icon',
            attributes: {
              type: 'image/png',
              sizes: '32x32',
            },
          },
        },
      },
    });
    expect(result.length).greaterThan(0);
    expect(result[0].name?.[0]).toBe('hps/evolve/home');
    const checkFiles: string[] = [
      'public/hps/evolve/assets/cover-ccfa96b6.jpg',
      'public/hps/evolve/home/index.html',
    ];

    for (const checkFile of checkFiles) {
      expect(existsSync(join(projectCwd, checkFile))).toBe(true);
    }

    const assets = fileWalkSync(['public/hps/evolve/home/*.{js,css}'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(3);
    const styleFile = assets.find((s) => /.css$/.test(s));
    const styleFileData = readFileSync(styleFile || '', 'utf-8');
    expect(styleFileData).toMatch(`font-size:.2rem`);
    expect(styleFileData).toMatch(`.child`);

    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('<title>evolve-home</title>');
    expect(htmlStr).toMatch(
      '<link rel="icon" href="base64:favicon" type="image/png" sizes="32x32">'
    );
    expect(htmlStr).toMatch('current devicePixelRatio:');
  });

  it('The project build with for options `useRelativeAssetPath:true`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          useRelativeAssetPath: true,
        },
      },
    });

    const assets = fileWalkSync(['public/hps/evolve/home/*.css'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    const styleFileData = readFileSync(assets[0] || '', 'utf-8');

    expect(styleFileData).toMatch(`font-size:.2rem`);

    expect(styleFileData).toMatch(
      `../../../hps/evolve/assets/cover-ccfa96b6.jpg`
    );

    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('<title>evolve-home</title>');

    expect(htmlStr).toMatch('current devicePixelRatio:');
  });

  it('The project build with for options `allowPx2rem:false`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          allowPx2rem: false,
        },
      },
    });

    const assets = fileWalkSync(['public/hps/evolve/home/*.css'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    const styleFileData = readFileSync(assets[0] || '', 'utf-8');
    expect(styleFileData).toMatch(`font-size:20px`);
    expect(styleFileData).toMatch(
      `https://hps.cdn.domain.com/hps/evolve/assets/cover-ccfa96b6.jpg`
    );

    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('<title>evolve-home</title>');

    expect(htmlStr).not.toMatch('current devicePixelRatio:');
  });

  it('The project build with for options `viewport:""`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          viewport: '',
        },
      },
    });

    const assets = fileWalkSync(['public/hps/evolve/home/*.css'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    const styleFileData = readFileSync(assets[0] || '', 'utf-8');
    expect(styleFileData).toMatch(`font-size:.2rem`);

    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('<title>evolve-home</title>');

    expect(htmlStr).not.toMatch('current devicePixelRatio:');
  });

  it('The project build with for options `headScripts`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          headScripts: [
            {
              id: 'script/1',
              src: 'http://script/1',
              position: 'end',
              order: 1,
            },
            {
              id: 'script/2',
              src: 'http://script/2',
              position: 'end',
              order: 2,
            },
          ],
        },
      },
    });
    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('http://script/1');
    expect(htmlStr).toMatch('http://script/2');
  });

  it('The project build with for options `headStyles`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          headStyles: () => [
            {
              id: 'style/1',
              href: 'http://style/1',
              rel: 'stylesheet',
              position: 'end',
              order: 1,
            },
            {
              id: 'style/2',
              href: 'http://style/2',
              rel: 'stylesheet',
              position: 'end',
              order: 2,
            },
          ],
        },
      },
    });
    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('http://style/1');
    expect(htmlStr).toMatch('http://style/2');
  });

  it('The project build with for options `headStyles` property function', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          headStyles(config) {
            // using property function format instead ()=> to testing serializer
            return [
              {
                id: 'style/1',
                href: 'http://style/1',
                rel: 'stylesheet',
                position: 'end',
                order: 1,
              },
              {
                id: 'style/2',
                href: 'http://style/2',
                rel: 'stylesheet',
                position: 'end',
                order: 2,
              },
              {
                id: 'cdn',
                href: config.envCdn,
                rel: 'stylesheet',
                position: 'end',
                order: 3,
              },
            ];
          },
        },
      },
    });
    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    expect(htmlStr).toMatch('http://style/1');
    expect(htmlStr).toMatch('http://style/2');
    expect(htmlStr).toMatch('<link href="https://hps.cdn.domain.com');
  });

  it('The project build with for options `htmlMinify`', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          title: 'evolve-home',
          htmlMinify: false,
        },
      },
    });
    const htmlStr = readFileSync(
      join(projectCwd, `public/hps/evolve/home/index.html`),
      'utf-8'
    );
    // No minify `<meta charset="utf-8" />`
    // minified `<meta charset="utf-8">`
    expect(htmlStr).toMatch('<meta charset="utf-8">');
  });

  it('The project build with for options `sourceMap`', async () => {
    await doBuild(
      ['home'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
          options: {
            title: 'evolve-home',
          },
        },
      },
      {
        rspack: {
          sourceMap: 'source-map',
        },
      }
    );

    const assetMaps = fileWalkSync(['public/hps/evolve/home/*.map'], {
      cwd: projectCwd,
    });

    expect(assetMaps.length).greaterThanOrEqual(1);
  });

  it('Should correct build mine module svg Icon', async () => {
    await doBuild(
      ['mine'],
      {
        home: {
          entry: ['./src/home/index.tsx'],
          options: {
            moduleFederation: {
              exposes: {
                './Widget': {
                  import: './src/home/widget.tsx',
                  // will be auto generated `hps/evolve/home/exposed-micro-module-home-widget`
                  name: `exposed-micro-module-home-widget`,
                },
              },
            },
          },
        },
        mine: {
          entry: ['./src/mine/index.tsx'],
          options: {
            moduleFederation: {
              remotes: [
                {
                  // will be gereated unique module name `hps_evolve_home` (hps/evolve/home) ref to `home` module
                  name: `home`,
                },
              ],
            },
          },
        },
      },
      {
        rspack: {
          // Do not minimizer
          minimizer: false,
        },
      }
    );

    const assets = fileWalkSync(['public/hps/evolve/mine/*.js'], {
      cwd: projectCwd,
    });

    expect(assets.length).toBe(1);
    const jsFileData = readFileSync(assets[0] || '', 'utf-8');
    expect(jsFileData).toMatch(
      `module.exports["default"] = module.exports = {"viewBox":"0 0 1024 1024",`
    );
  });

  it('Should correct handle import image', async () => {
    await doBuild(['home'], {
      home: {
        entry: ['./src/home/index.tsx'],
        options: {
          moduleFederation: {
            exposes: {
              './Widget': {
                import: './src/home/widget.tsx',
                // will be auto generated `hps/evolve/home/exposed-micro-module-home-widget`
                name: `exposed-micro-module-home-widget`,
              },
            },
          },
        },
      },
    });

    const assets = fileWalkSync(['public/hps/evolve/home/*.js'], {
      cwd: projectCwd,
    });

    const scriptFileData = readFileSync(assets[0] || '', 'utf-8');

    expect(scriptFileData).toMatch(
      `https://hps.cdn.domain.com/hps/evolve/assets/pc-404-938b44e8.png`
    );
    expect(scriptFileData).toMatch(
      `https://hps.cdn.domain.com/hps/evolve/assets/temp-374dd778.webp`
    );
  });
});
