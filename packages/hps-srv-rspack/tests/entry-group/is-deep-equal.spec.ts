import { join } from 'path';
import { isDeepEqual } from '@hyperse/hps-srv-common';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { ignoreEntryOptionKeys } from '../../src/constants.js';
import {
  deleteObjectKeys,
  type EvolveEntryItemOption,
} from '../../src/index.js';

const cdnConfig = {
  headScripts: function (): TemplateOptions['headScripts'] {
    return [
      {
        id: 'antd.min.js',
        src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/antd.min.js',
        position: 'beginning',
        order: 1,
      },
    ];
  },
  headStyles: function (): TemplateOptions['headStyles'] {
    return [
      {
        id: 'reset.min.css',
        href: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
        position: 'beginning',
        order: 1,
      },
    ];
  },
  bodyScripts: function (): TemplateOptions['bodyScripts'] {
    return [
      {
        id: 'reset.min.css',
        src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
        position: 'beginning',
        order: 1,
      },
    ];
  },
  headMetaTags: function (): TemplateOptions['headMetaTags'] {
    return ['HPS'];
  },
};

const fn = () => {
  return 'test';
};

describe('is-deep-equal-options', () => {
  const options: EvolveEntryItemOption = {
    title: 'test',
    favicon: {
      href: 'https://i.pravatar.cc/150?img=22',
      rel: 'icon',
      attributes: {
        type: 'image/png',
      },
    },
    templatePath: join(process.cwd(), './index.html'),
    htmlMinify: false,
    viewport: 'width=device-width',
    headInlineScripts: [],
    headMetaTags: () => cdnConfig.headMetaTags(),
    bodyScripts: () => cdnConfig.bodyScripts(),
    headScripts: () => cdnConfig.headScripts(),
    headStyles: () => cdnConfig.headStyles(),
    allowPx2rem: true,
    externals: {
      react: 'React',
    },
    enableBundleHashName: true,
    servePageMainLinkFn: fn,
    serveGlobalData: { isHps: true },
    moduleFederation: {
      library: {
        type: 'commonjs',
      },
    },
    useRelativeAssetPath: true,
    mockFilters: [/\.mock\.(js|ts)$/],
    output: {
      library: {
        name: 'dashboardPluginChart',
        type: 'var',
      },
    },
  };
  it('compare two evolve options : object', async () => {
    const one: EvolveEntryItemOption = {
      ...options,
    };
    const two: EvolveEntryItemOption = {
      ...options,
      moduleFederation: undefined,
    };
    const three: EvolveEntryItemOption = {
      ...options,
      output: {
        library: {
          name: '@dimjs/utils',
          type: 'global',
        },
      },
    };
    const four: EvolveEntryItemOption = {
      ...options,
      headMetaTags: ['HPS'],
      bodyScripts: [],
      headScripts: [],
      headStyles: [],
    };
    const five: EvolveEntryItemOption = {
      ...options,
      mockFilters: [/\.mock\.js$/, /\.mock\.ts$/],
    };
    const six: EvolveEntryItemOption = {
      ...options,
      servePageMainLinkFn: () => 'test',
    };
    const seven: EvolveEntryItemOption = {
      ...options,
      servePageMainLinkFn: fn,
    };
    const eight: EvolveEntryItemOption = {
      ...options,
      title: 'home',
      servePageMainLinkFn: fn,
    };
    const nine: EvolveEntryItemOption = {
      ...options,
      title: 'test',
      headMetaTags: () => cdnConfig.headMetaTags(),
      bodyScripts: () => cdnConfig.bodyScripts(),
      headScripts: () => cdnConfig.headScripts(),
      headStyles: () => cdnConfig.headStyles(),
    };
    expect(isDeepEqual(options, one)).toBe(true);
    expect(isDeepEqual(options, two)).toBe(false);
    expect(isDeepEqual(options, three)).toBe(false);
    expect(isDeepEqual(options, four)).toBe(false);
    expect(isDeepEqual(options, five)).toBe(false);
    expect(isDeepEqual(options, six)).toBe(false);
    expect(isDeepEqual(options, seven)).toBe(true);
    expect(
      isDeepEqual(
        deleteObjectKeys(options, ignoreEntryOptionKeys),
        deleteObjectKeys(eight, ignoreEntryOptionKeys)
      )
    ).toBe(true);
    expect(isDeepEqual(options, nine)).toBe(true);
  });

  it('compare two evolve options : functions', async () => {
    const optionsA: EvolveEntryItemOption = {
      headMetaTags: () => cdnConfig.headMetaTags(),
      bodyScripts: () => cdnConfig.bodyScripts(),
      headScripts: () => cdnConfig.headScripts(),
      headStyles: () => cdnConfig.headStyles(),
    };

    const optionsB: EvolveEntryItemOption = {
      headMetaTags: () => cdnConfig.headMetaTags(),
      bodyScripts: () => cdnConfig.bodyScripts(),
      headScripts: () => cdnConfig.headScripts(),
      headStyles: () => cdnConfig.headStyles(),
    };
    expect(isDeepEqual(optionsA, optionsB)).toBe(true);
  });
});
