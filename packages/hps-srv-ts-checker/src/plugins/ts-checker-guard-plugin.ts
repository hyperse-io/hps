import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import { logger, mergeOptions } from '@hyperse/hps-srv-common';
import { type Compiler } from '@rspack/core';
import { IssueError } from '../helpers/helper-issue-error.js';

export interface TsCheckerGuardPluginOption {
  /**
   * Whether to exit the process when issues is not empty
   * @default false
   */
  autoExit?: boolean;
}

export class TsCheckerGuardPlugin {
  private options: TsCheckerGuardPluginOption;
  constructor(option: TsCheckerGuardPluginOption = {}) {
    this.options = mergeOptions<TsCheckerGuardPluginOption>(
      {
        autoExit: false,
      },
      option
    );
  }

  apply(compiler: Compiler) {
    const hooks = TsCheckerRspackPlugin.getCompilerHooks(compiler);
    hooks.start.tap('start', (filesChange) => {
      logger.info(`Check typing...`);
      return filesChange;
    });
    // don't show warnings
    hooks.issues.tap('issues', (issues, compilation) => {
      const { autoExit } = this.options;
      const compilationErrors = compilation?.getErrors();
      if (compilationErrors && compilationErrors.length > 0) {
        logger.error(
          `Found ${compilationErrors.length} errors in ${compilationErrors.map((error) => error.message).join(', ')}`
        );
      }
      const errorIssues = issues.filter((issue) => issue.severity === 'error');
      if (autoExit && errorIssues?.length > 0) {
        throw new IssueError(errorIssues);
      }
      return issues;
    });
  }
}
