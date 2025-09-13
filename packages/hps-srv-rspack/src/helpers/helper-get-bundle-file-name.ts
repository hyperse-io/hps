/**
 * Get current timestramp as `string`
 */
export const currNow = (): string => Date.now().toString();

/**
 * Generate bundle file name from rules
 * 1. if `serveMode`, always return `bundle
 * 2. else if `enableBundleHashName` always return `bundle[contenthash].{css,js}`
 * 3. otherwise return `bundle.{css,js}?${currNow}`
 * @param type `js` | `css`
 * @param serveMode If we are run `serve` mode
 * @param enableBundleHashName If we need to generate bundle file name with `[contenthash]`
 */
export const getBundleFileName = (
  type: 'css' | 'js',
  serveMode: boolean,
  enableBundleHashName = true
): string => {
  const fileEndFix = type === 'js' ? '.js' : '.css';
  if (serveMode) {
    return `bundle${fileEndFix}`;
  }
  if (enableBundleHashName) {
    return `bundle[contenthash]${fileEndFix}`;
  }
  return `bundle${fileEndFix}?${currNow()}`;
};
