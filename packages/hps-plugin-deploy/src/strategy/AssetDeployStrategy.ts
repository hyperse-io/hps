import type { Logger } from '@hyperse/wizard';

/**
 * Configuration options for asset deployment strategies
 */
export type AssetDeployStrategyOptions = {
  /** The project's current working directory */
  projectCwd: string;
  /** The relative path of the cwd */
  relativePath: string;
  /** Logger instance for output */
  logger: Logger;
  /** Prefix to add to file paths during deployment */
  prefix: string;
  /** Whether to disable colored output */
  noColor: boolean;
  /** Whether to override existing files */
  overrideExistFile: boolean;
};

/**
 * Interface for asset deployment strategies
 *
 * This interface defines the contract that all deployment strategies must implement.
 * Each strategy handles deploying assets to a specific target (e.g., Aliyun OSS, AWS S3, etc.).
 */
export interface AssetDeployStrategy {
  /**
   * The unique name of the strategy
   *
   * This name is used to identify the strategy when specified as a deployment target.
   * Must be unique across all registered strategies.
   */
  readonly name: string;

  /**
   * Initialize the strategy
   *
   * This method is called when the strategy is initialized.
   * It is used to initialize the strategy with the environment variables.
   */
  init(): Promise<void>;
  /**
   * Deploy assets to the target platform
   *
   * @param filePaths - Array of absolute file paths to deploy
   * @param options - Configuration options for the deployment
   * @returns Promise that resolves when deployment is complete
   *
   * @example
   * ```typescript
   * class MyDeployStrategy implements AssetDeployStrategy {
   *   readonly name = 'my-target';
   *
   *   async deploy(filePaths: string[], options: AssetDeployStrategyOptions): Promise<void> {
   *     for (const filePath of filePaths) {
   *       // Deploy each file to your target platform
   *       await this.uploadFile(filePath, options);
   *     }
   *   }
   * }
   * ```
   */
  deploy(
    filePaths: string[],
    options: AssetDeployStrategyOptions
  ): Promise<void>;
}
