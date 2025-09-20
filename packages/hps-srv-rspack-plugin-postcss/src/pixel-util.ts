import { type RootElementType } from './types.js';

export const isObject = (o: unknown): boolean =>
  typeof o === 'object' && o !== null;

/**
 * Round off the last decimal place
 * @param num input for fixed
 * @param precision We keep how many places behind the decimal point
 */
export const toFixed = (num: number, precision: number): number => {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(num * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
};

/**
 * The properties that should not change from px to rem Values need to be exact matches.
 * @param prop The declaration's property name. e.g. margin, font-size, ...
 * @param blackList Values need to be exact matches.
 * @returns true indicates should not change unit; otherwise enabled current convert loop.
 */
export const blacklistedProp = (
  prop: string,
  blackList?: Array<string | RegExp>
): boolean => {
  if (typeof prop !== 'string') {
    return false;
  }
  if (!blackList || !blackList.length) {
    return false;
  }
  return blackList.some((regex) => {
    if (typeof regex === 'string') {
      return prop.includes(regex);
    } else {
      return regex.exec(prop);
    }
  });
};

/**
 * The properties that can change from px to rem
 * Default is an empty array that means disable the white list and enable all properties.
 * @param prop The declaration's property name. e.g. margin, font-size, ...
 * @param whiteList Values need to be exact matches.
 * @returns true indicates enabled all properties. otherwise false.
 */
export const passedWhiteListProp = (
  prop: string,
  whiteList?: Array<string | RegExp>
): boolean => {
  if (typeof prop !== 'string') {
    return true;
  }
  if (!whiteList || !whiteList.length) {
    return true;
  }
  return whiteList.some((regex) => {
    if (typeof regex === 'string') {
      return prop.includes(regex);
    } else {
      return regex.exec(prop);
    }
  });
};
/**
 * The selectors to ignore and leave as px
 * @example
 * If value is string, it checks to see if selector contains the string.
 *   ['body'] will match .body-class
 * If value is regexp, it checks to see if the selector matches the regexp.
 *   [/^body$/] will match body but not .body
 * @param selector
 * @param selectorBlackList  The selectors to ignore and leave as px
 * @returns true indicates should not change unit; otherwise enabled current convert loop.
 */
export const blacklistedSelector = (
  selector: string,
  selectorBlackList?: Array<string | RegExp>
): boolean => {
  if (typeof selector !== 'string') {
    return false;
  }
  if (!selectorBlackList || !selectorBlackList.length) {
    return false;
  }
  return selectorBlackList.some((regex) => {
    if (typeof regex === 'string') {
      return selector.includes(regex);
    } else {
      return regex.exec(selector);
    }
  });
};
/**
 * @example
 * const input = 'h1 { margin: 0 0 00.5px 16px; border-width: 001px; font-size: 32px; font-family: "16px"; }';
 * const output = 'h1 { margin: 0 0 .5px 0.16rem; border-width: 1px; font-size: 0.32rem; font-family: "16px"; }';
 * @param identifier single property will be ignored
 * @param unit 'px' or 'rpx' or 'px|rpx'
 */
export const handleIgnoreIdentifierRegex = (
  identifier: string,
  unit: string
): RegExp => {
  const backslashfy = `\\${identifier.split('').join('\\')}`;
  const pattern = `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|((?:${backslashfy}|\\d*)\\.?\\d+)(${unit})`;
  return new RegExp(pattern, 'gi');
};

/**
 * Create an replacer for style decleration value string .
 */
export const createPxReplace =
  (
    rootValue: RootElementType,
    unitPrecision: number,
    minPixelValue: number,
    unit: string,
    identifier?: string
  ): ((...args: string[]) => string) =>
  (m: string, $1: string, $2: string) => {
    if (!$1) {
      return m;
    }
    if (identifier && m.indexOf(identifier) === 0) {
      return m.replace(identifier, '');
    }
    const pixels = parseFloat($1);
    if (pixels < minPixelValue) {
      return m;
    }
    // { px: 100, rpx: 50 }
    const baseValue = isObject(rootValue)
      ? rootValue[$2 as keyof RootElementType]
      : rootValue;
    if (typeof baseValue !== 'number') {
      return m;
    }
    const fixedVal = toFixed(pixels / baseValue, unitPrecision);
    return `${fixedVal}${unit}`;
  };
