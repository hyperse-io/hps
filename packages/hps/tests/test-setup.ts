import { existsSync } from 'fs';
import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { execNpmInstaller } from '@armit/package';

export const checkNodeModules = async (projectCwd: string) => {
  const nodeModulesPath = join(projectCwd, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    console.log(
      'The node_modules in the test environment are being installed. Skipping.'
    );
    return;
  }

  console.log('Start install node_modules...');
  await execNpmInstaller(projectCwd);
};

export default async function setup() {
  const projectCwd = getDirname(import.meta.url, 'evolve/fixtures');
  await checkNodeModules(projectCwd);
}
