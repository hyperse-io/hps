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

  private aliyunConfig: AliyunConfig;

  /**
   * Initialize the strategy
   *
   * This method is called when the strategy is initialized.
   * It is used to initialize the strategy with the environment variables.
   */
  async init(): Promise<void> {
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
      const errorMessage = [
        'Missing required Aliyun configuration. Please ensure the following environment variables are set:',
        '',
        'Required environment variables:',
        ...missingConfigs.map((config) => `  • ${config}`),
        '',
        'You can set these variables in your .env file or directly in your environment.',
        'Example .env file:',
        '  REMOTE_CDN_BASE_URL=https://your-cdn.example.com',
        '  ALIYUN_API_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com',
        '  ALIYUN_ACCESS_KEY_SECRET=your_access_key_secret',
        '  ALIYUN_ACCESS_KEY_ID=your_access_key_id',
        '  ALIYUN_BUCKET_NAME=your_bucket_name',
      ].join('\n');

      throw new Error(errorMessage);
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
    const lookupCwd = join(options.projectCwd, options.relativePath);
    const relativePath = relative(lookupCwd, filePath);
    const relativePathWithPrefix = join(options.prefix, relativePath);

    const spinner = yoctoSpinner({
      text: `[${this.name}] Uploading ${relativePathWithPrefix}`,
    }).start();

    try {
      const result = await uploadToAliyun(
        filePath,
        relativePathWithPrefix,
        uploaderOptions,
        options.logger
      );

      if (result) {
        spinner.success();
      } else {
        spinner.warning(
          `[${this.name}] Skip uploading ${relativePathWithPrefix}`
        );
      }
    } catch (error) {
      spinner.error();
      throw error;
    }
  }
}
