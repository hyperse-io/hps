import { getURLSearchParamStr } from './get-url-search-param-str.js';

export const getQueryString = (url: string, name: string): string | null => {
  const params = new URLSearchParams(getURLSearchParamStr(url));
  return params.get(name);
};
