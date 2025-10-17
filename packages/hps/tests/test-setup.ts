import { existsSync } from 'fs';
import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { execNpmInstaller } from '@armit/package';

export const checkNodeModules = async (projectCwd: string) => {
  const nodeModulesPath = join(projectCwd, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    return;
  }
  console.log('Start install node_modules...');
  await execNpmInstaller(projectCwd);
};

const projectCwd = getDirname(import.meta.url, 'evolve/fixtures');

await checkNodeModules(projectCwd);
