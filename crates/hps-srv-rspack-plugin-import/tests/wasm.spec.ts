import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { test } from 'vitest';
import { transform } from '@swc/core';

const pluginName = 'hps_srv_rspack_plugin_import.wasm';

const transformCode = async (code: string) => {
  return transform(code, {
    jsc: {
      parser: {
        syntax: 'ecmascript',
      },
      target: 'es2018',
      experimental: {
        plugins: [
          [
            path.join(
              path.dirname(url.fileURLToPath(import.meta.url)),
              '..',
              'dist',
              pluginName
            ),
            {
              modularImports: [
                {
                  libraryName: '@dimjs/lang',
                  libraryDirectory: 'dist',
                  transformToDefaultImport: true,
                  methodNameToFiles: {
                    isArray: '@dimjs/lang/dist/is-array.js',
                  },
                },
                {
                  libraryName: '@dimjs/utils',
                  libraryDirectory: 'dist',
                  transformToDefaultImport: true,
                  customName: '@dimjs/utils/es/{{ kebabCase member }}/index.js',
                },
                {
                  libraryName: '@ant-design/icons',
                  libraryDirectory: 'es/icons',
                  transformToDefaultImport: true,
                  camel2DashComponentName: false,
                  customName: '@ant-design/icons/es/icons/{{ member }}.js',
                },
              ],
            },
          ],
        ],
      },
    },
    filename: 'test.js',
  });
};

describe('wasm', () => {
  test('Should load remove-console wasm plugin correctly', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/input.js', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input);

    expect(code).toContain(
      `import arrayChunk from "@dimjs/utils/es/array-chunk/index.js";`
    );
    expect(code).toContain(
      `import isArray from "@dimjs/lang/dist/is-array.js";`
    );
    expect(code).toContain(
      `import CloseCircleFilled from "@ant-design/icons/es/icons/CloseCircleFilled.js";`
    );
    expect(code).toContain(
      `import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined.js";`
    );
  });
});
