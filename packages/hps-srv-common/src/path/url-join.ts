import { ensureSlash } from './ensure-slash.js';
import { modifyQueryString } from './modify-query-string.js';

/**
 * Url path join generator
 * @example
 * ```ts
 * // input https://flatjs.com, ['path'], {name:'tian'} ==>https://flatjs.com/path?name=tian
 * // input /webview/page, ['path'], {name:'tian'} ==>/webview/page/path?name=tian
 * ```
 * @param baseUrl the http url without query string https://flatjs.com or /webview/test/
 * @param paths array<string> the path fragment
 * @param query query string object
 * @returns combinated url without tail slash.
 */
export const urlJoin = (
  url: string,
  paths: string[],
  query: Record<string, string> = {}
): string => {
  const parts = url.split('?');
  const clean = (s: string) => ensureSlash(s.replace(/^\/+|\/+$/g, ''), false);
  const searchParams = new URLSearchParams(parts[1]);
  for (const key of Object.keys(query)) {
    searchParams.append(key, query[key]);
  }
  let newUrlBase = [ensureSlash(parts[0], false)]
    .concat(paths.map((s) => clean(s)))
    .join('/');
  searchParams.forEach((value, key) => {
    newUrlBase = modifyQueryString(newUrlBase, key, value);
  });
  return newUrlBase;
};
