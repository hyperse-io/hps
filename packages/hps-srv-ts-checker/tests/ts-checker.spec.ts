import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalk, getDirname } from '@armit/file-utility';
import { createTsCheckerCompiler } from '../src/index.js';

const fixtureCwd = getDirname(import.meta.url, './fixtures');

async function cleanFiles() {
  const files = await fileWalk('**/*.*', {
    cwd: fixtureCwd,
    ignore: ['**/tsconfig.json'],
  });

  for (const file of files) {
    if (existsSync(file)) {
      rmSync(file, { recursive: true });
    }
  }
}

describe('Should correct resolve module imports via tsconfig.json', () => {
  beforeEach(cleanFiles);
  afterAll(cleanFiles);

  it('throw error with *.ts file', async () => {
    writeFileSync(join(fixtureCwd, 'a.ts'), 'const a:number = "11111";');

    await expect(async () => {
      await createTsCheckerCompiler({
        serveMode: false,
        projectCwd: fixtureCwd,
      });
    }).rejects.toThrow();
  });

  it('throw error with *.tsx file', async () => {
    writeFileSync(join(fixtureCwd, 'b.tsx'), 'const b:number = "22222";');

    await expect(async () => {
      await createTsCheckerCompiler({
        serveMode: false,
        projectCwd: fixtureCwd,
      });
    }).rejects.toThrow();
  });

  it('check error message', async () => {
    writeFileSync(
      join(fixtureCwd, 'c.tsx'),
      `
    const c:number = "33333";
    function f(params:string) {
      return 'hello world';
    }
    `
    );

    try {
      await createTsCheckerCompiler({
        serveMode: false,
        projectCwd: fixtureCwd,
      });
    } catch (error) {
      expect(error).toEqual('TS_CHECKER_ERROR: Found 1 errors 0 warnings .');
    }
  });
});
