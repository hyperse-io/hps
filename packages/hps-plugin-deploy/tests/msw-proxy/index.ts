import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { aliyunDeployApi } from './aliyun/aliyunServer.js';
import { aswDeployApi } from './aws/awsServer.js';
import { ftpDeployApi } from './ftp/ftpServer.js';

const handlers: Array<RequestHandler> = [
  ftpDeployApi(),
  aswDeployApi(),
  aliyunDeployApi(),
];

export const server = setupServer(...handlers);
