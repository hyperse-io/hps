import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};
