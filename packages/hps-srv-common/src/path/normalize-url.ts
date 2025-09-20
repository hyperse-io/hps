import { baseURL } from './constant.js';

export const normalizeUrl = (newUrl: string, oriUrl: string) => {
  const replacePattern = oriUrl.startsWith('/') ? '/' : '';
  return newUrl ? newUrl.replace(new RegExp(baseURL), replacePattern) : '';
};
