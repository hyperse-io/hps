import hasYarn from 'has-yarn';
import { dirname } from 'node:path';
import { packageUpSync } from 'package-up';

/**
 * Check if a project is using Yarn, It checks if a yarn.lock file is present in the working directory.
 * Useful for tools that needs to know whether to use yarn or npm to install dependencies.
 * @returns
 */
export const projectHasYarn = (cwd?: string) => {
  // try to find the parent to support monorepo
  let packageFile = packageUpSync({
    cwd: cwd || process.cwd(),
  });
  let level = 0;
  let found = hasYarn(packageFile);
  while (!found && packageFile && level < 2) {
    packageFile = packageUpSync({
      cwd: dirname(dirname(packageFile)),
    });
    if (packageFile) {
      found = hasYarn(dirname(packageFile));
    }
    level++;
  }
  return found;
};
