import { type HpsMockOptions } from './types/types-options.js';

export const defaultMockOptions: HpsMockOptions = {
  projectCwd: process.cwd(),
  mockBaseDir: './mocks',
  apiContext: '/api',
  hostname: 'dev.hps.com',
  externals: [
    '@hyperse/hps-srv-mock',
    '@hyperse/hps-srv-common',
    'mockjs',
    'lodash',
    'class-validator',
    'class-transformer',
  ],
  port: 4000,
  chunkSize: 100,
  staticMap: {
    '/static': 'static',
  },
  mockMap: {
    '/*': { type: 'REST', defs: [], middlewares: { req: [], res: [] } },
  },
};
