import { join } from 'node:path';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { ignoreEntryOptionKeys } from '../../src/constants.js';
import {
  autoGrouping,
  manualGrouping,
  splitToEntryGroup,
} from '../../src/helpers/helper-split-to-entry-group.js';
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
  loaderOptions: {},
  htmlCdn: '',
  entryMap: {},
};

describe('split-to-entry-group.spec', () => {
  it('manual grouping', async () => {
    const servedEntries: (EvolveEntryMapContent & { entryName: string })[] = [
      {
        entry: ['./src/home/index.ts'],
        groupName: 'group_A',
        entryName: 'home',
      },
      {
        entry: ['./src/mine/index.ts'],
        groupName: 'group_A',
        entryName: 'mine',
      },
      {
        entry: ['./src/category/index.ts'],
        groupName: 'group_B',
        entryName: 'category',
      },
      {
        entry: ['./src/goods/index.ts'],
        groupName: 'group_C',
        entryName: 'goods',
      },
      {
        entry: ['./src/order/index.ts'],
        groupName: 'group_C',
        entryName: 'order',
      },
    ];

    const result = manualGrouping(servedEntries);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      home: {
        entry: ['./src/home/index.ts'],
        groupName: 'group_A',
        entryName: 'home',
      },
      mine: {
        entry: ['./src/mine/index.ts'],
        groupName: 'group_A',
        entryName: 'mine',
      },
    });
    expect(result[1]).toEqual({
      category: {
        entry: ['./src/category/index.ts'],
        groupName: 'group_B',
        entryName: 'category',
      },
    });
    expect(result[2]).toEqual({
      goods: {
        entry: ['./src/goods/index.ts'],
        groupName: 'group_C',
        entryName: 'goods',
      },
      order: {
        entry: ['./src/order/index.ts'],
        groupName: 'group_C',
        entryName: 'order',
      },
    });
  });

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

    evolveOptions.maxEntryGroupSize = 10;
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

    evolveOptions.maxEntryGroupSize = 3;
    const result = autoGrouping(
      evolveOptions,
      servedEntries,
      ignoreEntryOptionKeys,
      true
    );
    expect(result).toHaveLength(3);
    expect(Object.keys(result[0])).toHaveLength(3);
    expect(Object.keys(result[1])).toHaveLength(3);
    expect(Object.keys(result[2])).toHaveLength(1);
  });

  it('manual grouping & auto grouping', async () => {
    const servedEntries: {
      [K in string]: EvolveEntryMapContent;
    } = {
      home: {
        entry: ['./src/home/index.ts'],
        groupName: 'home',
        groupingSource: 'manual',
        options: {
          title: 'home',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: ['home'],
        },
      },
      mine: {
        entry: ['./src/mine/index.ts'],
        groupName: 'home',
        groupingSource: 'manual',
        options: {
          title: 'mine',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      category: {
        entry: ['./src/category/index.ts'],
        groupName: join(process.cwd(), '/category'),
        groupingSource: 'auto',
        options: {
          title: 'category',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      goods: {
        entry: ['./src/goods/index.ts'],
        groupName: 'goods',
        groupingSource: 'manual',
        options: {
          title: 'goods',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
      order: {
        entry: ['./src/order/index.ts'],
        groupName: join(process.cwd(), '/order'),
        groupingSource: 'auto',
        options: {
          title: 'order',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
      setting: {
        entry: ['./src/order/index.ts'],
        groupName: join(process.cwd(), '/setting'),
        groupingSource: 'auto',
        options: {
          title: 'setting',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
    };

    const evolveOptions: HpsEvolveOptions = {
      projectCwd: process.cwd(),
      loaderOptions: {},
      htmlCdn: '',
      entryMap: {},
      projectVirtualPath: 'flat/evolve/pages',
    };

    const result_isolation_false = splitToEntryGroup(
      servedEntries,
      evolveOptions,
      ignoreEntryOptionKeys,
      true
    );
    expect(result_isolation_false).toHaveLength(4);
    expect(result_isolation_false[0]).toHaveProperty('home');
    expect(result_isolation_false[0]).toHaveProperty('mine');
    expect(result_isolation_false[1]).toHaveProperty('goods');
    expect(result_isolation_false[2]).toHaveProperty('category');
    expect(result_isolation_false[3]).toHaveProperty('order');
    expect(result_isolation_false[3]).toHaveProperty('setting');

    evolveOptions.isolation = true;
    const result_isolation_true = splitToEntryGroup(
      servedEntries,
      evolveOptions,
      ignoreEntryOptionKeys,
      true
    );
    expect(result_isolation_true).toHaveLength(6);
    expect(result_isolation_true[0]).toHaveProperty('home');
    expect(result_isolation_true[1]).toHaveProperty('mine');
    expect(result_isolation_true[2]).toHaveProperty('category');
    expect(result_isolation_true[3]).toHaveProperty('goods');
    expect(result_isolation_true[4]).toHaveProperty('order');
    expect(result_isolation_true[5]).toHaveProperty('setting');
  });

  it('auto grouping & assign groupName', async () => {
    const servedEntries: {
      [K in string]: EvolveEntryMapContent;
    } = {
      home: {
        entry: ['./src/home/index.ts'],
        groupingSource: 'auto',
        options: {
          title: 'home',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: ['home'],
        },
      },
      mine: {
        entry: ['./src/mine/index.ts'],
        groupingSource: 'auto',
        options: {
          title: 'mine',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      category: {
        entry: ['./src/category/index.ts'],
        groupingSource: 'auto',
        options: {
          title: 'category',
          templatePath: join(process.cwd(), '/public'),
        },
      },
      goods: {
        entry: ['./src/goods/index.ts'],
        groupingSource: 'auto',
        options: {
          title: 'goods',
          templatePath: join(process.cwd(), '/public'),
          headMetaTags: () => cdnConfig.headMetaTags(),
          bodyScripts: () => cdnConfig.bodyScripts(),
          headScripts: () => cdnConfig.headScripts(),
          headStyles: () => cdnConfig.headStyles(),
        },
      },
    };

    const evolveOptions: HpsEvolveOptions = {
      projectCwd: process.cwd(),
      loaderOptions: {},
      htmlCdn: '',
      entryMap: {},
      projectVirtualPath: 'flat/evolve/pages',
    };

    const result_isolation_false = splitToEntryGroup(
      servedEntries,
      evolveOptions,
      ignoreEntryOptionKeys,
      true
    );

    expect(result_isolation_false).toHaveLength(3);
    expect(result_isolation_false[0]).toHaveProperty('home');
    expect(result_isolation_false[0]['home']).toBeDefined();
    expect(result_isolation_false[0]['home']['groupName']).toBe(
      `${evolveOptions.projectVirtualPath}/a`
    );
    expect(result_isolation_false[1]).toHaveProperty('mine');
    expect(result_isolation_false[1]['mine']).toBeDefined();
    expect(result_isolation_false[1]['mine']['groupName']).toBe(
      `${evolveOptions.projectVirtualPath}/b`
    );
    expect(result_isolation_false[1]).toHaveProperty('category');
    expect(result_isolation_false[1]['category']).toBeDefined();
    expect(result_isolation_false[1]['category']['groupName']).toBe(
      `${evolveOptions.projectVirtualPath}/b`
    );
    expect(result_isolation_false[2]).toHaveProperty('goods');
    expect(result_isolation_false[2]['goods']).toBeDefined();
    expect(result_isolation_false[2]['goods']['groupName']).toBe(
      `${evolveOptions.projectVirtualPath}/c`
    );

    const result_isolation_false_with_original_group_count = splitToEntryGroup(
      servedEntries,
      evolveOptions,
      ignoreEntryOptionKeys,
      true,
      3
    );
    expect(
      result_isolation_false_with_original_group_count[0]['home']['groupName']
    ).toBe(`${evolveOptions.projectVirtualPath}/d`);
    expect(
      result_isolation_false_with_original_group_count[1]['mine']['groupName']
    ).toBe(`${evolveOptions.projectVirtualPath}/e`);
    expect(
      result_isolation_false_with_original_group_count[1]['category'][
        'groupName'
      ]
    ).toBe(`${evolveOptions.projectVirtualPath}/e`);
    expect(
      result_isolation_false_with_original_group_count[2]['goods']['groupName']
    ).toBe(`${evolveOptions.projectVirtualPath}/f`);
  });
});
