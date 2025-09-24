import { join } from 'node:path';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { ignoreEntryOptionKeys } from '../../src/constants.js';
import { autoGrouping } from '../../src/helpers/helper-split-to-entry-group.js';
import {
  type EvolveEntryMapContent,
  type HpsEvolveOptions,
} from '../../src/index.js';

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

const evolveOptions: HpsEvolveOptions = {
  projectCwd: process.cwd(),
  projectVirtualPath: 'flat/evolve/',
  devServer: {},
  rspack: {
    loader: {},
    plugins: {
      htmlPlugin: {
        htmlCdn: '',
      },
    },
  },
  entryMap: {},
};

describe('split-to-entry-group.spec', () => {
  it('auto grouping', async () => {
    const servedEntries: (EvolveEntryMapContent & { entryName: string })[] = [
      {
        entry: ['./src/home/index.ts'],
        entryName: 'home',
        options: {
          title: 'home',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: ['home'],
        },
      },
      {
        entry: ['./src/mine/index.ts'],
        entryName: 'mine',
        options: {
          title: 'mine',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/category/index.ts'],
        entryName: 'category',
        options: {
          title: 'category',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: ['category'],
        },
      },
      {
        entry: ['./src/goods/index.ts'],
        entryName: 'goods',
        options: {
          title: 'goods',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
      {
        entry: ['./src/order/index.ts'],
        entryName: 'order',
        options: {
          title: 'order',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
    ];

    const result = autoGrouping(
      evolveOptions,
      servedEntries,
      ignoreEntryOptionKeys,
      true
    );

    expect(result).toHaveLength(4);
    expect(result[0]).toHaveProperty('home');
    expect(result[1]).toHaveProperty('mine');
    expect(result[2]).toHaveProperty('category');
    expect(Object.values(result[3])).toBeDefined();
    expect(Object.values(result[3])).toHaveLength(2);
    expect(Object.values(result[3])).toHaveLength(2);
  });

  it('auto grouping & slice by maxEntryGroupSize', async () => {
    const servedEntries: (EvolveEntryMapContent & { entryName: string })[] = [
      {
        entry: ['./src/a/index.ts'],
        entryName: 'a',
        options: {
          title: 'a',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/b/index.ts'],
        entryName: 'b',
        options: {
          title: 'b',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/c/index.ts'],
        entryName: 'c',
        options: {
          title: 'c',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/d/index.ts'],
        entryName: 'd',
        options: {
          title: 'd',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/e/index.ts'],
        entryName: 'e',
        options: {
          title: 'e',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/f/index.ts'],
        entryName: 'f',
        options: {
          title: 'f',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      {
        entry: ['./src/g/index.ts'],
        entryName: 'g',
        options: {
          title: 'g',
          templatePath: join(process.cwd(), '/public'),
        },
      },
    ];

    const result = autoGrouping(
      evolveOptions,
      servedEntries,
      ignoreEntryOptionKeys,
      true
    );
    expect(result).toHaveLength(1);
    expect(Object.keys(result[0])).toHaveLength(7);
  });
});
