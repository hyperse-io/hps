import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageDirectory } from 'package-directory';

/**
 * Get the package.json of the CLI
 * @returns The package.json of the CLI
 */
export const getCliPackage = async () => {
  const packageDir = await packageDirectory({ cwd: import.meta.dirname });
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
