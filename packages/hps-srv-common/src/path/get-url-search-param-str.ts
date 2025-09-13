import { baseURL } from './constant.js';

export const getURLSearchParamStr = (url: string): string => {
  if (!url) {
    return '';
  }
  const myUri = new URL(url, baseURL);
  return myUri.searchParams.toString();
};
