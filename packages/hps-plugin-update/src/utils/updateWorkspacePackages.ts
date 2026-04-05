import { searchConfig } from '@hyperse/config-loader';
import type { Logger } from '@hyperse/wizard';
import { getWorkspacePackages } from './getWorkspacePackages.js';
import { ncuUpdate } from './ncuUpdate.js';
import { writeCacheFile, writeNcuConfig } from './writeConfigFile.js';

export type UpdateWorkspacePackagesOptions = {
  logger: Logger;
  noColor: boolean;
  projectCwd: string;
  force?: boolean;
  filter?: string[];
  reject?: string[];
  verbose?: boolean;
  deep?: boolean;
};

type NcuConfig = {
  dep: string[];
  reject: string[];
};

export const updateWorkspacePackages = async (
  options: UpdateWorkspacePackagesOptions
) => {
  const cwd = options.projectCwd;
  const workspaces = await getWorkspacePackages(cwd);
  const { force, logger, ...ncuOptions } = options;

  // write the ncu config file
  writeNcuConfig(cwd);
  // write the ncu cache file
  const cacheFile = writeCacheFile(force);
  const explorer = await searchConfig<NcuConfig>('ncu', cwd);
  const ncuConfig = explorer?.config;
  const deps = ncuConfig?.dep;
  const reject = ncuConfig?.reject;
  const dirsToUpdate = [
    cwd,
    ...[...workspaces.keys()].filter((d) => d !== cwd),
  ];
  logger.debug({
    name: 'updateWorkspacePackages:\n',
    message: dirsToUpdate.join('\n'),
  });

  for (const dir of dirsToUpdate) {
    const nestedConfig = await searchConfig<NcuConfig>('ncu', dir);
    const nestedNcuConfig = nestedConfig?.config;
    const nestedDeps = nestedNcuConfig?.dep;
    const nestedReject = nestedNcuConfig?.reject;
    const ncuDeps = nestedDeps ? nestedDeps : deps;
    const ncuReject = nestedReject ? nestedReject : reject;

    await ncuUpdate({
      ...ncuOptions,
      cacheFile,
      cwd: dir,
      dep: ncuDeps,
      reject: ncuReject || ncuOptions?.reject,
      deep: ncuOptions.deep || false,
    });
  }
};
