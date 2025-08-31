export type AssetDeployStrategyOptions = {
  projectCwd: string;
  logger: any;
  prefix: string;
  noColor: boolean;
  overrideExistFile: boolean;
};

/**
 * The asset deploy strategy.
 */
export interface AssetDeployStrategy {
  /**
   * The name of the strategy.
   */
  name: string;
  /**
   * The function to deploy the asset.
   * @param filePaths The file paths of the asset.
   * @param options The options of the strategy.
   * @returns The promise to deploy the asset.
   */
  deploy(
    filePaths: string[],
    options: AssetDeployStrategyOptions
  ): Promise<void>;
}
