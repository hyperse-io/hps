import { type PostcssPluginPixelOptions } from './types.js';

export const defaultOpts: Required<PostcssPluginPixelOptions> = {
  rootValue: { px: 100, rpx: 1 },
  outputUnit: 'rem',
  unitPrecision: 5,
  selectorBlackList: [],
  propWhiteList: [],
  propBlackList: [],
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
  ignoreIdentifier: '',
  exclude: null,
};
