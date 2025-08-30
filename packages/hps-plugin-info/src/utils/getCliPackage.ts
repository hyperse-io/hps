import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageDirectory } from 'package-directory';
import { requireResolve } from './requireResolve.js';

/**
 * Get the package.json of the CLI
 * @returns The package.json of the CLI
 */
export const getCliPackage = async () => {
  const packageMain = await requireResolve(import.meta.url, '@hyperse/hps');
  const packageDir = await packageDirectory({ cwd: packageMain });
  if (packageDir) {
    const packageJson = JSON.parse(
      readFileSync(join(packageDir, 'package.json'), 'utf-8')
    );
    return packageJson as {
      name: string;
      version: string;
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      peerDependencies: Record<string, string>;
    };
  }
  return undefined;
};
