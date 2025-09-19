export type RootElementType = {
  [prop in 'px' | 'rpx']?: number;
};

export interface PostcssPluginPixelOptions {
  /**
   * (Number|Object) The root element font size. Default is 100.
   * If rootValue is an object, for example { px: 50, rpx: 100 }, it will replace rpx to 1/100 rem , and px to 1/50 rem.
   * px, rpx is target unit you want to replace
   * @default rootValue={ px: 100, rpx: 1 }
   */
  rootValue?: RootElementType;
  /**
   * The unit you want to output
   * @default rem
   */
  outputUnit?: 'rem' | 'rpx';
  /**
   * The decimal numbers to allow the REM units to grow to.
   * @default 5
   */
  unitPrecision?: number;
  /**
   * Default is an empty array that means disable the white list and enable all properties.
   * Values need to be exact matches.
   * @default []
   */
  propWhiteList?: Array<string | RegExp>;
  /**
   * The properties that should not change from px to rem
   * Values need to be exact matches.
   * @default []
   */
  propBlackList?: Array<string | RegExp>;
  /**
   * The selectors to ignore and leave as px
   * @example
   * If value is string, it checks to see if selector contains the string.
   *  - ['body'] will match .body-class
   * If value is regexp, it checks to see if the selector matches the regexp.
   *  - [/^body$/] will match body but not .body
   * @default []
   */
  selectorBlackList?: Array<string | RegExp>;
  /**
   * a way to have a single property ignored.
   * when ignoreIdentifier enabled, then replace would be set to true automatically.
   */
  ignoreIdentifier?: string;
  /**
   * replaces rules containing rems instead of adding fallbacks.
   * @example replace rule ("font-size: 15px;") into ("font-size: 0.15rem")
   * @default true
   */
  replace?: boolean;
  /**
   * (Reg) a way to exclude some folder,eg. /(node_module)/.
   * @default false
   */
  exclude?: RegExp | null;
  /**
   * Allow px to be converted in media queries.
   * @default false
   */
  mediaQuery?: boolean;
  /**
   * Set the minimum pixel value to replace.
   * @default 0
   */
  minPixelValue?: number;
}
