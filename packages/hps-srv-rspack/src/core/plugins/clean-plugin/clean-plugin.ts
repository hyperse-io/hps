import { rmSync } from 'node:fs';
import { relative } from 'node:path';
import { fileWalkSync } from '@armit/file-utility';
import { logger } from '@hyperse/hps-srv-common';
import { type Compilation, type Compiler, type Stats } from '@rspack/core';
import { moduleName } from '../../../constants.js';

export interface Options {
  /**
   * The project root.
   */
  projectCwd?: string;
  /**
   * Write Logs to Console
   * (Always enabled when dry is true)
   *
   * default: false
   */
  verbose?: boolean;

  /**
   * Automatically remove all unused webpack assets on rebuild
   *
   * default: true
   */
  cleanStaleWebpackAssets?: boolean;

  /**
   * Do not allow removal of current webpack assets
   *
   * default: true
   */
  protectWebpackAssets?: boolean;

  /**
   * Removes files once prior to Webpack compilation
   *   Not included in rebuilds (watch mode)
   *
   * Use !negative patterns to exclude files
   *
   * default: ['**\/*']
   */
  cleanOnceBeforeBuildPatterns?: string[];

  /**
   * Removes files after every build (including watch mode) that match this pattern.
   * Used for files that are not created directly by Webpack.
   *
   * Use !negative patterns to exclude files
   *
   * default: []
   */
  cleanAfterEveryBuildPatterns?: string[];
}

export class CleanPlugin {
  private readonly verbose: boolean;
  private readonly cleanStaleWebpackAssets: boolean;
  private readonly protectWebpackAssets: boolean;
  private readonly cleanAfterEveryBuildPatterns: string[];
  private readonly cleanOnceBeforeBuildPatterns: string[];
  private currentAssets: string[];
  private initialClean: boolean;
  private outputPath: string;
  private projectCwd: string;

  constructor(options: Options = {}) {
    this.verbose = options.verbose === true || false;
    this.projectCwd = options.projectCwd || process.cwd();

    this.cleanStaleWebpackAssets =
      options.cleanStaleWebpackAssets === true ||
      options.cleanStaleWebpackAssets === false
        ? options.cleanStaleWebpackAssets
        : true;

    this.protectWebpackAssets =
      options.protectWebpackAssets === true ||
      options.protectWebpackAssets === false
        ? options.protectWebpackAssets
        : true;

    this.cleanAfterEveryBuildPatterns = Array.isArray(
      options.cleanAfterEveryBuildPatterns
    )
      ? options.cleanAfterEveryBuildPatterns
      : [];

    this.cleanOnceBeforeBuildPatterns = Array.isArray(
      options.cleanOnceBeforeBuildPatterns
    )
      ? options.cleanOnceBeforeBuildPatterns
      : ['**/*'];

    /**
     * Store webpack build assets
     */
    this.currentAssets = [];

    /**
     * Only used with cleanOnceBeforeBuildPatterns
     */
    this.initialClean = false;

    this.outputPath = '';

    this.apply = this.apply.bind(this);
    this.handleInitial = this.handleInitial.bind(this);
    this.handleDone = this.handleDone.bind(this);
    this.removeFiles = this.removeFiles.bind(this);
  }

  apply(compiler: Compiler) {
    if (!compiler.options.output || !compiler.options.output.path) {
      logger.warn(
        'clean-webpack-plugin: options.output.path not defined. Plugin disabled...'
      );
      return;
    }

    this.outputPath = compiler.options.output.path;

    /**
     * webpack 4+ comes with a new plugin system.
     *
     * Check for hooks in-order to support old plugin system
     */
    const hooks = compiler.hooks;

    if (this.cleanOnceBeforeBuildPatterns.length !== 0) {
      hooks.emit.tap('clean-webpack-plugin', (compilation) => {
        this.handleInitial(compilation);
      });
    }
    hooks.done.tap('clean-webpack-plugin', (stats) => {
      logger.info('start clean cache...');
      this.handleDone(stats);
    });
  }

  /**
   * Initially remove files from output directory prior to build.
   *
   * Only happens once.
   *
   * Warning: It is recommended to initially clean your build directory outside of webpack to minimize unexpected behavior.
   */
  handleInitial(compilation: Compilation) {
    if (this.initialClean) {
      return;
    }

    /**
     * Do not remove files if there are compilation errors
     *
     * Handle logging inside this.handleDone
     */
    const stats = compilation.getStats();
    if (stats.hasErrors()) {
      return;
    }

    this.initialClean = true;

    this.removeFiles(this.cleanOnceBeforeBuildPatterns);
  }

  handleDone(stats: Stats) {
    /**
     * Do nothing if there is a webpack error
     */
    if (stats.hasErrors()) {
      if (this.verbose) {
        logger.warn('clean-webpack-plugin: pausing due to webpack errors');
      }

      return;
    }

    /**
     * Fetch Webpack's output asset files
     */
    const assets =
      stats.toJson({
        assets: true,
      }).assets || [];

    const assetList = assets.map((asset: { name: string }) => {
      return asset.name;
    });

    /**
     * Get all files that were in the previous build but not the current
     *
     * (relies on del's cwd: outputPath option)
     */
    const staleFiles = this.currentAssets.filter((previousAsset) => {
      return assetList.includes(previousAsset) === false;
    });

    /**
     * Save assets for next compilation
     */
    this.currentAssets = assetList.sort();

    const removePatterns: string[] = [];

    /**
     * Remove unused webpack assets
     */
    if (this.cleanStaleWebpackAssets === true && staleFiles.length !== 0) {
      removePatterns.push(...staleFiles);
    }

    /**
     * Remove cleanAfterEveryBuildPatterns
     */
    if (this.cleanAfterEveryBuildPatterns.length !== 0) {
      removePatterns.push(...this.cleanAfterEveryBuildPatterns);
    }

    if (removePatterns.length !== 0) {
      this.removeFiles(removePatterns);
    }
  }

  removeFiles(patterns: string[]) {
    try {
      const deleted = fileWalkSync(patterns, {
        absolute: true,
        unique: true,
        // Change context to build directory
        cwd: this.outputPath,
        dot: true,
        ignore: this.protectWebpackAssets ? this.currentAssets : [],
      });

      for (const filepath of deleted) {
        rmSync(filepath, {
          force: true,
          recursive: true,
        });
      }
      /**
       * Log if verbose is enabled
       */
      if (this.verbose) {
        deleted.forEach((file) => {
          const filename = relative(this.projectCwd, file);
          const message = 'removed';
          /**
           * Use console.warn over .log
           * https://github.com/webpack/webpack/issues/1904
           * https://github.com/johnagan/clean-webpack-plugin/issues/11
           */
          logger.debug(`clean-webpack-plugin: ${message} ${filename}`);
        });
      }
    } catch (error) {
      const needsForce =
        /Cannot delete files\/folders outside the current working directory\./.test(
          (error as Error).message
        );

      if (needsForce) {
        const message =
          'clean-webpack-plugin: Cannot delete files/folders outside the current working directory. Can be overridden with the `dangerouslyAllowCleanPatternsOutsideProject` option.';

        throw new Error(message);
      }

      throw error;
    }
  }
}
