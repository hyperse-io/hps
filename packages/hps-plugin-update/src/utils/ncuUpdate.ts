import { run, type RunOptions } from 'npm-check-updates';
import { projectHasYarn } from './projectHasYarn.js';

export type NcuUpdateOptions = Pick<
  RunOptions,
  | 'cwd'
  | 'filter'
  | 'reject'
  | 'rejectVersion'
  | 'registry'
  | 'timeout'
  | 'silent'
  | 'cacheFile'
>;

export async function ncuUpdate(options: NcuUpdateOptions) {
  await run({
    cacheExpiration: 20,
    deep: false,
    mergeConfig: false,
    jsonUpgraded: false,
    packageManager: projectHasYarn() ? 'yarn' : 'npm',
    upgrade: true,
    cache: true,
    cwd: options.cwd,
    cacheFile: options.cacheFile,
    filter: options.filter,
    timeout: options.timeout || 30000,
    registry: options.registry,
    reject: options.reject,
    rejectVersion: options.rejectVersion,
    silent: options.silent,
  });
}
