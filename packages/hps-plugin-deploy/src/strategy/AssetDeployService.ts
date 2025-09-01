import { prepareUploadFiles } from '../utils/prepareUploadFiles.js';
import type {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from './AssetDeployStrategy.js';

/**
 * Configuration options for the AssetDeployService
 * Extends AssetDeployStrategyOptions with deployment-specific settings
 */
export type AssetDeployServiceOptions = AssetDeployStrategyOptions & {
  /** Array of target deployment strategy names to execute */
  target: Array<string>;
  /** Available deployment strategies that can be used */
  deployStrategies: AssetDeployStrategy[];
  /** File patterns to include in deployment (e.g., ['**\/*.js', '**\/*.css']) */
  matchPatterns: Array<string>;
  /** File patterns to exclude from deployment (e.g., ['**\/*.map', 'node_modules\/**']) */
  ignorePatterns: Array<string>;
};

/**
 * Service responsible for orchestrating asset deployment across multiple strategies
 *
 * This service handles:
 * - Validation of deployment strategies (duplicates, target existence)
 * - File preparation and filtering based on patterns
 * - Execution of deployment strategies for specified targets
 */
export class AssetDeployService {
  /**
   * Creates a new AssetDeployService instance
   * @param options - Configuration options for the deployment service
   */
  constructor(private readonly options: AssetDeployServiceOptions) {}

  /**
   * Main deployment method that orchestrates the entire deployment process
   *
   * This method:
   * 1. Validates deployment strategies for duplicates
   * 2. Ensures target strategies exist
   * 3. Prepares files for upload based on match/ignore patterns
   * 4. Executes deployment for each target strategy
   */
  async deploy() {
    // Validate that no duplicate strategy names exist
    await this.checkDuplicatedStrategies();

    // Ensure at least one target strategy is available
    await this.checkTargetStrategies();

    // Prepare files for upload by filtering based on patterns
    const waitingUploadFiles = await prepareUploadFiles({
      lookupCwd: this.options.projectCwd,
      matchPatterns: this.options.matchPatterns,
      ignorePatterns: this.options.ignorePatterns,
    });

    if (waitingUploadFiles.length === 0) {
      this.options.logger.warn('No files to deploy');
      return;
    }

    // Deploy to each specified target
    for (const target of this.options.target) {
      // Find the strategy that matches the current target
      const targetStrategy = this.options.deployStrategies.find(
        (strategy) => target === strategy.name
      );

      if (!targetStrategy) {
        this.options.logger.error(
          `No deploy strategies found for target: ${target}`
        );
        continue; // Skip this target and continue with others
      }

      // Execute the deployment strategy with prepared files
      await targetStrategy.deploy(waitingUploadFiles, {
        ...this.options,
      });
    }
  }

  /**
   * Validates that all specified target strategies exist in the available strategies
   *
   * @throws {Error} When no target strategies are found for the specified targets
   */
  private async checkTargetStrategies() {
    // Filter strategies to find those matching the specified targets
    const targetStrategies = this.options.deployStrategies.filter((strategy) =>
      this.options.target.includes(strategy.name)
    );

    if (targetStrategies.length === 0) {
      // Create a list of available targets for better error messaging
      const availableTargets = this.options.deployStrategies
        .map((strategy) => strategy.name)
        .join(', ');

      throw new Error(
        `No deploy strategies found for target: ${this.options.target.join(', ')}, available targets: ${availableTargets}`
      );
    }
  }

  /**
   * Validates that no duplicate strategy names exist in the deployStrategies array
   *
   * @throws {Error} When duplicate strategy names are found
   */
  private async checkDuplicatedStrategies() {
    // Find strategies that appear more than once (duplicates)
    const duplicatedStrategies = this.options.deployStrategies.filter(
      (strategy, index, self) =>
        self.findIndex((s) => s.name === strategy.name) !== index
    );

    if (duplicatedStrategies.length > 0) {
      throw new Error(
        `Duplicated deploy strategies: ${duplicatedStrategies.map((s) => s.name).join(', ')}`
      );
    }
  }
}
