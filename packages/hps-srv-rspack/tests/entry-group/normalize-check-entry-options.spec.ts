import { join } from 'path';
import { isDeepEqual, urlJoin } from '@hyperse/hps-srv-common';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { ignoreEntryOptionKeys } from '../../src/constants.js';
import { deleteObjectKeys } from '../../src/helpers/helper-normalize-check-entry-options.js';
import { normalizeCheckEntryOptions } from '../../src/helpers/helper-normalize-check-entry-options.js';
import {
  type EvolveEntryItemOption,
  type HtmlPluginConfigConfigData,
} from '../../src/index.js';

const cdnConfig = {
  headScripts: function ({
    mode,
    envCdn,
  }: {
    mode: string;
    envCdn: string;
  }): TemplateOptions['headScripts'] {
    if (mode === 'production') {
      return [
        {
          id: 'antd.min.js',
          src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/antd.min.js',
          position: 'beginning',
          order: 1,
        },
        {
          id: 'production.js',
          src: envCdn + '/production.js',
          position: 'beginning',
          order: 2,
        },
      ];
    }
    return [
      {
        id: 'antd.min.js',
        src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/antd.min.js',
        position: 'beginning',
        order: 1,
      },
      {
        id: 'development.js',
        src: envCdn + '/development.js',
        position: 'beginning',
        order: 2,
      },
    ];
  },
  headStyles: function ({
    mode,
    envCdn,
  }: {
    mode: string;
    envCdn: string;
  }): TemplateOptions['headStyles'] {
    if (mode === 'production') {
      return [
        {
          id: 'reset.min.css',
          href: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
          position: 'beginning',
          order: 1,
        },
        {
          id: 'production.css',
          href: envCdn + '/production.css',
          position: 'beginning',
          order: 1,
        },
      ];
    }
    return [
      {
        id: 'reset.min.css',
        href: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
        position: 'beginning',
        order: 1,
      },
      {
        id: 'development.css',
        href: envCdn + '/development.css',
        position: 'beginning',
        order: 2,
      },
    ];
  },
  bodyScripts: function ({
    mode,
    envCdn,
  }: {
    mode: string;
    envCdn: string;
  }): TemplateOptions['bodyScripts'] {
    if (mode === 'production') {
      return [
        {
          id: 'reset.min.css',
          src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
          position: 'beginning',
          order: 1,
        },
        {
          id: 'production.css',
          src: envCdn + '/production.css',
          position: 'beginning',
          order: 2,
        },
      ];
    }
    return [
      {
        id: 'reset.min.css',
        src: 'https://cdn.jsdelivr.net/npm/antd@5.27.3/dist/reset.min.css',
        position: 'beginning',
        order: 1,
      },
      {
        id: 'development.css',
        src: envCdn + '/development.css',
        position: 'beginning',
        order: 2,
      },
    ];
  },
  headMetaTags: function ({
    mode,
    envCdn,
  }: {
    mode: string;
    envCdn: string;
  }): TemplateOptions['headMetaTags'] {
    return ['HPS', mode, envCdn];
  },
};

const fn = () => {
  return 'test';
};

describe('normalize-check-entry-options.spec', () => {
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
    headInlineStyles: [],
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
  it('env = development', async () => {
    const configData: HtmlPluginConfigConfigData = {
      mode: 'development',
      envCdn: urlJoin('http://dev.hps.com/apps', ['public']),
    };

    const originalOptions = {
      ...options,
      headMetaTags: cdnConfig.headMetaTags(configData),
      bodyScripts: cdnConfig.bodyScripts(configData),
      headScripts: cdnConfig.headScripts(configData),
      headStyles: cdnConfig.headStyles(configData),
    };

    const targetOptions: EvolveEntryItemOption = {
      ...options,
      title: 'test',
      headMetaTags: cdnConfig.headMetaTags,
      bodyScripts: cdnConfig.bodyScripts,
      headScripts: cdnConfig.headScripts,
      headStyles: cdnConfig.headStyles,
    };
    expect(originalOptions.headMetaTags).toBeTypeOf('object');
    expect(originalOptions.bodyScripts).toBeTypeOf('object');
    expect(originalOptions.headScripts).toBeTypeOf('object');
    expect(originalOptions.headStyles).toBeTypeOf('object');

    expect(targetOptions.headMetaTags).toBeTypeOf('function');
    expect(targetOptions.bodyScripts).toBeTypeOf('function');
    expect(targetOptions.headScripts).toBeTypeOf('function');
    expect(targetOptions.headStyles).toBeTypeOf('function');

    const result = normalizeCheckEntryOptions(
      true,
      targetOptions,
      ignoreEntryOptionKeys
    );

    expect(result?.headMetaTags).toBeTypeOf('object');
    expect(result?.bodyScripts).toBeTypeOf('object');
    expect(result?.headScripts).toBeTypeOf('object');
    expect(result?.headStyles).toBeTypeOf('object');

    expect(
      isDeepEqual(
        deleteObjectKeys(originalOptions, ignoreEntryOptionKeys),
        result
      )
    ).toBe(true);
  });

  it('env = production', async () => {
    const configData: HtmlPluginConfigConfigData = {
      mode: 'production',
      envCdn: urlJoin('https://hps.pro.com/apps', ['public']),
    };

    const originalOptions = {
      ...options,
      headMetaTags: cdnConfig.headMetaTags(configData),
      bodyScripts: cdnConfig.bodyScripts(configData),
      headScripts: cdnConfig.headScripts(configData),
      headStyles: cdnConfig.headStyles(configData),
    };

    const targetOptions: EvolveEntryItemOption = {
      ...options,
      title: 'test',
      headMetaTags: cdnConfig.headMetaTags,
      bodyScripts: cdnConfig.bodyScripts,
      headScripts: cdnConfig.headScripts,
      headStyles: cdnConfig.headStyles,
    };

    const result = normalizeCheckEntryOptions(
      false,
      targetOptions,
      ignoreEntryOptionKeys
    );

    expect(result?.headMetaTags).toBeTypeOf('object');
    expect(result?.bodyScripts).toBeTypeOf('object');
    expect(result?.headScripts).toBeTypeOf('object');
    expect(result?.headStyles).toBeTypeOf('object');

    expect(
      isDeepEqual(
        deleteObjectKeys(originalOptions, ignoreEntryOptionKeys),
        result
      )
    ).toBe(true);
  });
});
