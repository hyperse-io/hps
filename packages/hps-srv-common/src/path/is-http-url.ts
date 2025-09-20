/**
 * check if given url is http url or path
 * @param url url
 */
export const isHttpUrl = (url: string): boolean => {
  return url
    ? url.startsWith('//') || /(?:https|http|ftp)?:\/\//.test(url)
    : false;
};
