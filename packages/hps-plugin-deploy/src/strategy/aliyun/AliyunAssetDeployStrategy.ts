import { join, relative } from 'node:path';
import yoctoSpinner from 'yocto-spinner';
import type {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from '../AssetDeployStrategy.js';
import { type AliyunUploaderOption, uploadToAliyun } from './uploadToAliyun.js';

/**
 * Configuration for Aliyun OSS deployment
 */
interface AliyunConfig {
  cdnBaseUrl?: string;
  uploadApi?: string;
  accessKeySecret?: string;
  accessKeyId?: string;
  bucketName?: string;
}

/**
 * Aliyun OSS deployment strategy
 *
 * This strategy handles deploying assets to Aliyun Object Storage Service (OSS).
 * It requires the following environment variables to be set:
 * - REMOTE_CDN_BASE_URL: The base URL for the CDN
 * - ALIYUN_API_ENDPOINT: The Aliyun API endpoint
 * - ALIYUN_ACCESS_KEY_SECRET: The access key secret
 * - ALIYUN_ACCESS_KEY_ID: The access key ID
 * - ALIYUN_BUCKET_NAME: The bucket name
 */
export class AliyunAssetDeployStrategy implements AssetDeployStrategy {
  readonly name = 'aliyun';

  private readonly aliyunConfig: AliyunConfig;

  constructor() {
    this.aliyunConfig = {
      cdnBaseUrl: process.env.REMOTE_CDN_BASE_URL,
      uploadApi: process.env.ALIYUN_API_ENDPOINT,
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
      bucketName: process.env.ALIYUN_BUCKET_NAME,
    };
  }

  /**
   * Validates that all required Aliyun configuration is present
   *
   * @throws {Error} If any required configuration is missing
   */
  private validateAliyunConfig(): void {
    const missingConfigs: string[] = [];

    if (!this.aliyunConfig.cdnBaseUrl) {
      missingConfigs.push('REMOTE_CDN_BASE_URL');
    }
    if (!this.aliyunConfig.uploadApi) {
      missingConfigs.push('ALIYUN_API_ENDPOINT');
    }
    if (!this.aliyunConfig.accessKeySecret) {
      missingConfigs.push('ALIYUN_ACCESS_KEY_SECRET');
    }
    if (!this.aliyunConfig.accessKeyId) {
      missingConfigs.push('ALIYUN_ACCESS_KEY_ID');
    }
    if (!this.aliyunConfig.bucketName) {
      missingConfigs.push('ALIYUN_BUCKET_NAME');
    }

    if (missingConfigs.length > 0) {
      throw new Error(
        `Missing required Aliyun configuration: ${missingConfigs.join(', ')}`
      );
    }
  }

  /**
   * Deploy files to Aliyun OSS
   *
   * @param filePaths - Array of absolute file paths to deploy
   * @param options - Deployment configuration options
   */
  async deploy(
    filePaths: string[],
    options: AssetDeployStrategyOptions
  ): Promise<void> {
    // Validate configuration before starting deployment
    this.validateAliyunConfig();

    // Convert config to uploader options
    const uploaderOptions: AliyunUploaderOption = {
      cdnBaseUrl: this.aliyunConfig.cdnBaseUrl!,
      uploadApi: this.aliyunConfig.uploadApi!,
      accessKeySecret: this.aliyunConfig.accessKeySecret!,
      accessKeyId: this.aliyunConfig.accessKeyId!,
      bucketName: this.aliyunConfig.bucketName!,
    };

    // Deploy each file
    for (const filePath of filePaths) {
      await this.deploySingleFile(filePath, options, uploaderOptions);
    }
  }

  /**
   * Deploy a single file to Aliyun OSS
   *
   * @param filePath - Absolute path to the file to deploy
   * @param options - Deployment configuration options
   * @param uploaderOptions - Aliyun uploader configuration
   */
  private async deploySingleFile(
    filePath: string,
    options: AssetDeployStrategyOptions,
    uploaderOptions: AliyunUploaderOption
  ): Promise<void> {
    const relativePath = relative(options.projectCwd, filePath);
    const relativePathWithPrefix = join(options.prefix, relativePath);

    const spinner = yoctoSpinner({
      text: `Uploading ${relativePathWithPrefix} to ${this.name}`,
    }).start();

    try {
      const result = await uploadToAliyun(
        filePath,
        relativePathWithPrefix,
        uploaderOptions
      );

      if (result) {
        spinner.success();
      } else {
        spinner.error();
      }
    } catch (error) {
      spinner.error();
      throw error;
    }
  }
}
