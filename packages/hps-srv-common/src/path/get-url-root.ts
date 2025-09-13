import { baseURL } from './constant.js';
import { normalizeUrl } from './normalize-url.js';

/**
 * @example
 * https://example.org/abc?name=123&name=234' => 'https://example.org/abc'
 * @param url the original url
 */
export const getURLRoot = (url: string): string => {
  if (!url) {
    return '';
  }
  const myUri = new URL(url, baseURL);
  myUri.search = '';
  myUri.hash = '';
  return normalizeUrl(myUri.href, url);
};
