import fs from 'node:fs/promises';
import { join, relative } from 'node:path';
import { test } from 'vitest';
import { getDirname } from './utils/getDirname.js';
import { transformCode } from './utils/transformCode.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const filePath = join(projectCwd, 'react.tsx');

describe('tests inspector swc plugin', () => {
  test('default options. should return absolute path', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input, filePath);

    expect(code).toBeDefined();
    expect(code).toContain('data-hps-source');
    expect(code).toContain(`${filePath}`);
  });

  test('projectCwd is projectCwd. should return relative path of projectCwd', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input, filePath, {
      projectCwd,
    });

    expect(code).toBeDefined();
    expect(code).toContain('data-hps-source');
    expect(code).toContain(`${relative(projectCwd, filePath)}`);
  });

  test('projectCwd is process.cwd(). should return relative path of process.cwd()', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input, filePath, {
      projectCwd: process.cwd(),
    });

    expect(code).toBeDefined();
    expect(code).toContain('data-hps-source');
    expect(code).toContain(`${relative(process.cwd(), filePath)}`);
  });

  test('isAbsolutePath is true. should return absolute path', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input, filePath, {});

    expect(code).toBeDefined();
    expect(code).toContain('data-hps-source');
    expect(code).toContain(`${filePath}`);
  });

  test('isAbsolutePath is true. should return absolute path. support nextjs', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );

    const fileName =
      '[project]/apps/main/src/app/[locale]/(account)/account/widgets/AccountView.tsx';

    const { code } = await transformCode(input, fileName, {
      projectCwd: process.cwd(),
    });

    expect(code).toBeDefined();
    expect(code).toContain('data-hps-source');
    expect(code).toContain(fileName.replace('[project]/', ''));
  });
});
