import { urlJoin } from '@hyperse/hps-srv-common';
import { ignoreEntryOptionKeys } from '../constants.js';
import { type EvolveEntryItemOption } from '../types/types-entry-map.js';
import type { HtmlPluginConfigConfigData } from '../types/types-multi-html.js';
import { normalizeTemplateInjectTokens } from './helper-normalize-template-inject-tokens.js';

/**
 * Deletes specified keys from an object and returns a new object without those keys.
 * If the input object is undefined, the function returns undefined.
 *
 * @param obj - The input object.
 * @param keys - An array of keys to be deleted from the object.
 * @returns A new object without the specified keys, or undefined if the input object is undefined.
 *
 * @template T - The type of the input object.
 */
export const deleteObjectKeys = <T>(
  obj?: T,
  keys: Array<keyof T> = []
): Partial<T> | undefined => {
  if (!obj) {
    return undefined;
  }
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
};

/**
 * Normalizes the check entry options.
 *
 * @param serveMode - A boolean indicating whether the serve mode is enabled.
 * @param currEntryOption - The current entry option.
 * @param ignoreOptionKeys - An array of keys to ignore in the entry option.
 * @returns The normalized entry options.
 */
export const normalizeCheckEntryOptions = (
  serveMode: boolean,
  currEntryOption?: EvolveEntryItemOption,
  ignoreOptionKeys: Array<keyof EvolveEntryItemOption> = ignoreEntryOptionKeys
): Partial<EvolveEntryItemOption> | undefined => {
  const mode = serveMode ? 'development' : 'production';
  const envCdnDomain = serveMode
    ? 'http://dev.flatjs.com'
    : 'https://file.40017.cn/jinfu';

  const configData: HtmlPluginConfigConfigData = {
    mode: mode,
    envCdn: urlJoin(envCdnDomain, ['public']),
  };

  const normalizeEntryOption = normalizeTemplateInjectTokens(
    configData,
    currEntryOption
  );

  const normalizedEntryOptions: EvolveEntryItemOption = {
    ...currEntryOption,
    ...normalizeEntryOption,
  };

  return deleteObjectKeys(normalizedEntryOptions, ignoreOptionKeys);
};
