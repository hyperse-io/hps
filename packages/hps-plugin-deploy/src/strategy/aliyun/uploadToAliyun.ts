import mimeTypes from 'mime-types';
import { createHash, createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { ensureSlash } from '../../utils/ensureSlash.js';
import { isRemoteFileExist } from '../../utils/isRemoteFileExist.js';

export interface AliyunUploaderOption {
  uploadApi: string;
  accessKeySecret: string;
  accessKeyId: string;
  bucketName: string;
  /**
   * CDN base URL: https://file.xxx.com/xxx
   */
  cdnBaseUrl: string;
  /**
   * @default false
   */
  overrideExistFile?: boolean;
}

const getGMTDate = () => {
  return new Date().toUTCString();
};

/**
 * Generates authentication headers for the Aliyun uploader.
 *
 * @param aliyunConfig The configuration for the Aliyun uploader.
 * @param objectKey The key of the object being uploaded.
 * @param fileData The data of the file being uploaded.
 * @param contentType The content type of the file being uploaded.
 * @returns The authentication headers for the upload request.
 */
const generateAuthHeaders = (
  aliyunConfig: AliyunUploaderOption,
  objectKey: string,
  fileData: string,
  contentType: string
) => {
  const { accessKeySecret, accessKeyId, bucketName } = aliyunConfig;

  const contentMd5 = createHash('md5').update(fileData).digest('base64');
  const date = getGMTDate();
  const canonicalizedResource = `/${bucketName}/${objectKey}`;
  const stringToSign = `PUT\n${contentMd5}\n${contentType}\n${date}\n${canonicalizedResource}`;
  const signature = createHmac('sha1', accessKeySecret)
    .update(stringToSign)
    .digest('base64');

  const headers = {
    Authorization: `OSS ${accessKeyId}:${signature}`,
    'Content-Type': contentType,
    'Content-Length': fileData.length.toString(),
    'Content-MD5': contentMd5,
    Date: date,
  };
  return headers;
};

/**
 * The aliyun upload service.
 * @param filePath The absolute path of the file to upload
 * @param objectKey The key of the object being uploaded.
 * @param aliyunConfig The aliyun connection configurations
 * @returns If return false indicates `ignored`, otherwise upload success.
 */
export const uploadToAliyun = async (
  filePath: string,
  objectKey: string,
  aliyunConfig: AliyunUploaderOption
): Promise<string | false> => {
  // Check if we have cdnBaseUrl or we want forcely override existed file?
  const needCheck =
    aliyunConfig.cdnBaseUrl && aliyunConfig.overrideExistFile !== true;

  if (needCheck) {
    const existed = await isRemoteFileExist(
      `${ensureSlash(aliyunConfig.cdnBaseUrl, false)}/${objectKey.replace(/^\//, '')}`
    );
    if (existed) {
      return false;
    }
  }
  const fileData = readFileSync(filePath, 'utf-8');
  const fileRelativePath = objectKey.replace(/^\//, '');
  const contentType = mimeTypes.lookup(filePath) || 'application/octet-stream';
  const headers = generateAuthHeaders(
    aliyunConfig,
    fileRelativePath,
    fileData,
    contentType
  );
  const fetchUrl = `${ensureSlash(aliyunConfig.uploadApi, false)}/${objectKey.replace(/^\//, '')}`;

  const response = await fetch(fetchUrl, {
    method: 'PUT',
    headers,
    body: fileData,
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return objectKey;
};
