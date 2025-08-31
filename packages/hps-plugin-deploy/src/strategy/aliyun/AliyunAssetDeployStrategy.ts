import { join, relative } from 'node:path';
import yoctoSpinner from 'yocto-spinner';
import type {
  AssetDeployStrategy,
  AssetDeployStrategyOptions,
} from '../AssetDeployStrategy.js';
import { type AliyunUploaderOption, uploadToAliyun } from './uploadToAliyun.js';

export class AliyunAssetDeployStrategy implements AssetDeployStrategy {
  name = 'aliyun';

  private readonly aliyunConfig: AliyunUploaderOption;

  constructor() {
    this.aliyunConfig = {
      cdnBaseUrl: process.env.REMOTE_CDN_BASE_URL,
      uploadApi: process.env.ALIYUN_API_ENDPOINT,
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
      bucketName: process.env.ALIYUN_BUCKET_NAME,
    };
  }

  // If any of the aliyun config is not set, throw an error
  private checkAliyunConfig() {
    if (!this.aliyunConfig.cdnBaseUrl) {
      throw new Error('REMOTE_CDN_BASE_URL is not set');
    }
    if (!this.aliyunConfig.uploadApi) {
      throw new Error('ALIYUN_API_ENDPOINT is not set');
    }
    if (!this.aliyunConfig.accessKeySecret) {
      throw new Error('ALIYUN_ACCESS_KEY_SECRET is not set');
    }
    if (!this.aliyunConfig.accessKeyId) {
      throw new Error('ALIYUN_ACCESS_KEY_ID is not set');
    }
    if (!this.aliyunConfig.bucketName) {
      throw new Error('ALIYUN_BUCKET_NAME is not set');
    }
  }

  async deploy(
    filePaths: string[],
    options: AssetDeployStrategyOptions
  ): Promise<void> {
    // Check if the aliyun config is set
    this.checkAliyunConfig();

    // Upload the files to the aliyun
    for (const filePath of filePaths) {
      const relativePath = relative(options.projectCwd, filePath);
      const relativePathWithPrefix = join(options.prefix, relativePath);
      const spinner = yoctoSpinner({
        text: `Uploading ${relativePathWithPrefix} to ${this.name}`,
      }).start();

      const result = await uploadToAliyun(
        filePath,
        relativePathWithPrefix,
        this.aliyunConfig
      );

      if (result) {
        spinner.success();
      } else {
        spinner.error();
      }
    }
  }
}
