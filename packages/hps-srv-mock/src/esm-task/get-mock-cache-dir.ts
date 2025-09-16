import { join } from 'node:path';
import { type HpsMockOptions } from '../types/types-options.js';

export const getMockCacheDir = (mockOptions: HpsMockOptions) => {
  const { projectCwd = process.cwd() } = mockOptions;
  return join(projectCwd, '.cache');
};
