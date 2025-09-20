import { join } from 'path';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { ignoreEntryOptionKeys } from '../../src/constants.js';
import { verifyGroupEntryOptions } from '../../src/helpers/helper-verify-group-entry-options.js';
import { type EvolveEntryMap } from '../../src/types/types-entry-map.js';

const cdnConfig = {
  headScripts: function (): TemplateOptions['headScripts'] {
    return [
      {
        id: '11',
        src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/antd.min.js',
        position: 'beginning',
        order: 1,
      },
    ];
  },
  headStyles: function (): TemplateOptions['headStyles'] {
    return [
      {
        id: '11',
        href: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
        position: 'beginning',
        order: 1,
      },
    ];
  },
  bodyScripts: function (): TemplateOptions['bodyScripts'] {
    return [
      {
        id: '11',
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

describe('verify-group-entry-options', () => {
  const groupEntryMap: EvolveEntryMap = {
    home: {
      entry: ['./src/home/index.ts'],
      groupName: 'home',
    },
    mine: {
      entry: ['./src/mine/index.ts'],
      groupName: 'home',
    },
  };
  it('undefined options', async () => {
    expect(
      verifyGroupEntryOptions(groupEntryMap, ignoreEntryOptionKeys, true)
    ).toBe(true);
  });
  it('undefined options and {}', async () => {
    groupEntryMap['home'].options = {};
    expect(
      verifyGroupEntryOptions(groupEntryMap, ignoreEntryOptionKeys, true)
    ).toBe(true);
  });
  it('use global ignoreEntryOptionKeys', async () => {
    groupEntryMap['home'].options = {
      title: 'home',
      templatePath: join(process.cwd(), '/public'),
    };
    groupEntryMap['mine'].options = {
      title: 'mine',
      templatePath: join(process.cwd(), '/public'),
    };
    //  use global ignoreEntryOptionKeys
    expect(
      verifyGroupEntryOptions(groupEntryMap, ignoreEntryOptionKeys, true)
    ).toBe(true);
  });
  it('not use global ignoreEntryOptionKeys', async () => {
    groupEntryMap['home'].options = {
      title: 'home',
      templatePath: join(process.cwd(), '/public'),
    };
    groupEntryMap['mine'].options = {
      title: 'mine',
      templatePath: join(process.cwd(), '/public'),
    };
    // not use global ignoreEntryOptionKeys
    expect(verifyGroupEntryOptions(groupEntryMap, [], true)).toBe(false);
  });
  it('value is functions', async () => {
    groupEntryMap['mine'].options = {
      title: 'mine',
      templatePath: join(process.cwd(), '/public'),
      headMetaTags: () => {
        return ['tag'];
      },
    };
    expect(
      verifyGroupEntryOptions(groupEntryMap, ignoreEntryOptionKeys, true)
    ).toBe(false);
  });
  it('complex options', async () => {
    groupEntryMap['home'].options = {
      title: 'home',
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
    groupEntryMap['mine'].options = {
      title: 'mine',
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
    expect(
      verifyGroupEntryOptions(groupEntryMap, ignoreEntryOptionKeys, true)
    ).toBe(true);
  });
});
