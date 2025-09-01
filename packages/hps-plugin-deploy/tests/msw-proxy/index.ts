import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { aliyunDeployApi } from './aliyun/aliyunServer.js';

const handlers: Array<RequestHandler> = [aliyunDeployApi()];

export const server = setupServer(...handlers);
