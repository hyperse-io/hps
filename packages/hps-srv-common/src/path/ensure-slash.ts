import { sep } from 'node:path';

/**
 * make sure the endfix slash as expect.
 * @param str path fragment
 * @param slashEndfix flag to indicates if we need keep last slash `/` or `\`
 * @param multiPlatform flag to indicates if we need to support multi platform
 */
export const ensureSlash = (
  str: string,
  slashEndfix = false,
  multiPlatform = false
): string => {
  str = str.replace(/\/$/, '').replace(/\\$/, '');
  const setSlash = multiPlatform ? sep : '/';
  return slashEndfix ? str + setSlash : str;
};
