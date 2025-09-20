/**
 * We need to normalize the page proxy to  make sure that we have prefix slash.
 * @param pageProxy `/pages`
 * @returns The normalized page proxy
 */
export const normalizePageProxy = (pageProxy: string = '/pages') => {
  const proxy = pageProxy.replace(/^\//, '').replace(/\/$/, '');
  return `/` + (proxy || 'pages');
};
