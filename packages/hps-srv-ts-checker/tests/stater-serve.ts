import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalk, getDirname } from '@armit/file-utility';
import { createTsCheckerCompiler } from '../src/index.js';

const fixtureCwd = getDirname(import.meta.url, './fixtures');

const files = await fileWalk('**/*.*', {
  cwd: fixtureCwd,
  ignore: ['**/tsconfig.json'],
});

for (const file of files) {
  if (existsSync(file)) {
    rmSync(file, { recursive: true });
  }
}

writeFileSync(join(fixtureCwd, 'a.ts'), 'const a:number = "11111";');

createTsCheckerCompiler({
  serveMode: false,
  projectCwd: fixtureCwd,
});
