import { run, type RunOptions } from 'npm-check-updates';
import { projectHasYarn } from './projectHasYarn.js';

export type NcuUpdateOptions = Pick<
  RunOptions,
  | 'cwd'
  | 'filter'
  | 'reject'
  | 'registry'
  | 'timeout'
  | 'silent'
  | 'cacheFile'
  | 'verbose'
  | 'dep'
>;

export async function ncuUpdate(options: NcuUpdateOptions) {
  await run({
    cacheExpiration: 20,
    deep: true,
    mergeConfig: true,
    jsonUpgraded: false,
    packageManager: projectHasYarn() ? 'yarn' : 'npm',
    upgrade: true,
    cache: true,
    cwd: options.cwd,
    cacheFile: options.cacheFile,
    filter: options.filter,
    reject: options.reject,
    timeout: options.timeout || 30000,
    registry: options.registry,
    silent: options.silent,
    verbose: options.verbose,
    dep: options.dep,
  });
}
