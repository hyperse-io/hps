import { baseURL } from './constant.js';
import { normalizeUrl } from './normalize-url.js';

export const removeQueryString = (url: string, key: string): string => {
  if (!url) {
    return '';
  }
  if (!key) {
    return url;
  }
  const myUri = new URL(url, baseURL);
  myUri.searchParams.delete(key);
  return normalizeUrl(myUri.href, url);
};
