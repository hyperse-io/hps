import { prepareUploadFiles } from '../utils/prepareUploadFiles.js';
import type {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from './AssetDeployStrategy.js';

export type AssetDeployServiceOptions = AssetDeployStrategyOptions & {
  target: Array<string>;
  deployStrategies: AssetDeployStrategy[];
  matchPatterns: Array<string>;
  ignorePatterns: Array<string>;
};

export class AssetDeployService {
  constructor(private readonly options: AssetDeployServiceOptions) {}

  async deploy() {
    // check duplicated deploy strategies
    await this.checkDuplicatedStrategies();

    // Make sure at least one target strategy is found
    await this.checkTargetStrategies();

    // prepare the files to upload
    const watingUploadFiles = await prepareUploadFiles(
      this.options.projectCwd,
      this.options.matchPatterns,
      this.options.ignorePatterns
    );

    for (const target of this.options.target) {
      const targetStrategy = this.options.deployStrategies.find(
        (strategy) => target === strategy.name
      );

      if (!targetStrategy) {
        this.options.logger.error(
          `No deploy strategies found for target: ${target}`
        );
        continue;
      }

      await targetStrategy.deploy(watingUploadFiles, {
        ...this.options,
      });
    }
  }

  private async checkTargetStrategies() {
    // check target strategies
    const targetStrategies = this.options.deployStrategies.filter((strategy) =>
      this.options.target.includes(strategy.name)
    );

    if (targetStrategies.length === 0) {
      const availableTargets = this.options.deployStrategies
        .map((strategy) => strategy.name)
        .join(', ');

      throw new Error(
        `No deploy strategies found for target: ${this.options.target.join(', ')}, available targets: ${availableTargets}`
      );
    }
  }

  private async checkDuplicatedStrategies() {
    // check duplicated deploy strategies
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
