import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { searchPackageDir } from '@armit/package';

export const getPackageDir = (...paths: string[]) => {
  const dir = getDirname(import.meta.url);
  const packageDir = searchPackageDir({
    cwd: dir,
  });
  if (!packageDir) {
    throw new Error('Could not resolve package root for `flatjs/evolve`');
  }
  return join(packageDir, ...paths);
};
