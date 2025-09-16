import { resolve } from 'node:path';
import { type HpsMockOptions } from '../types/types-options.js';

export const getMockCwd = (mockOptions: HpsMockOptions) => {
  const { projectCwd, mockBaseDir } = mockOptions;
  return resolve(projectCwd || process.cwd(), mockBaseDir || './mocks');
};
