import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { type DeepPartial } from '@hyperse/config-loader';
import { type HpsEvolveOptions } from '../../src/types/types-options.js';
import { startTestServe } from '../test-utils.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
process.env.NODE_ENV = 'test';

const overrideEvolveOptions: DeepPartial<HpsEvolveOptions> = {
  entryMap: {
    home: {
      entry: ['./src/home/index.tsx'],
      options: {
        title: 'Home',
        favicon: {
          href: '/favicon.ico',
          rel: 'icon',
          attributes: {
            type: 'image/x-icon',
          },
        },
        headInlineScripts(configData) {
          return [
            {
              id: 'cdn',
              content: `var cdn="${configData.envCdn}"`,
              position: 'end',
              order: 1,
            },
          ];
        },
        templatePath: join(projectCwd, '../module.html'),
      },
    },
    hmr: {
      entry: ['./src/hmr/index.tsx'],
      options: {},
    },
    hmrIframe: {
      entry: ['./src/hmrIframe/index.tsx'],
      options: {},
    },
    main: {
      entry: ['./src/main/index.tsx'],
      options: {},
    },
    hmrLibrary: {
      entry: ['./src/hmrLibrary/index.tsx'],
      options: {
        output: {
          library: {
            name: 'HmrLibrary',
            type: 'var',
          },
          libraryTarget: 'window',
        },
      },
    },
  },
};

await startTestServe(
  projectCwd,
  ['home', 'hmr', 'hmrIframe', 'main'],
  overrideEvolveOptions
);
