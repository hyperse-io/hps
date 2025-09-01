import type { Logger } from '@hyperse/wizard';
import { getWorkspacePackages } from './getWorkspacePackages.js';
import { ncuUpdate } from './ncuUpdate.js';
import { writeCacheFile, writeNcuConfig } from './writeConfigFile.js';

export type UpdateWorkspacePackagesOptions = {
  logger: Logger;
  noColor: boolean;
  projectCwd: string;
  force?: boolean;
};

export const updateWorkspacePackages = async (
  options: UpdateWorkspacePackagesOptions
) => {
  const cwd = options.projectCwd || process.cwd();
  const workspaces = await getWorkspacePackages(cwd);
  const { force, ...ncuOptions } = options;

  // write the ncu config file
  writeNcuConfig(cwd);

  // write the ncu cache file
  const cacheFile = writeCacheFile(force);

  for (const [dir] of workspaces) {
    options.logger.info(`Checking and updating dependencies in ${dir}`);
    await ncuUpdate({
      ...ncuOptions,
      cacheFile,
      cwd: dir,
    });
  }
};
