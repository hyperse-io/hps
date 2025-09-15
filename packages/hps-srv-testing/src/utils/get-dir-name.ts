import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Provider method to simulate __dirname veriable.
 * @param url import.meta.url
 * @param paths paths to join.
 */
export const getDirname = (url: string, ...paths: string[]) => {
  return join(dirname(fileURLToPath(url)), ...paths);
};
