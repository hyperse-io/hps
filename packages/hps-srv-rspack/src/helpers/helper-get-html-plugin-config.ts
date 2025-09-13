import { getPackageDir } from '@hyperse/hps-srv-common';
import { viewportScripts } from '../constants.js';
import { type MultiHtmlCDNEntryItem } from '../types/types-multi-html.js';

export const defaultHtmlPluginConfig: Required<MultiHtmlCDNEntryItem> = {
  // The page title
  title: '',
  // The page favicon url地址
  favicon: {
    href: '',
    rel: 'icon',
    attributes: { type: 'image/x-icon' },
  },
  // The customized html tags should be inject to `<header />`
  headMetaTags: [],
  // Allow us customized inline scripts into compiled html template.
  headInlineScripts: [],
  // Allow us customized inline styles into compiled html template.
  headInlineStyles: [],
  // The ordered styles will be injected start of html head.
  headStyles: [],
  // The ordered scripts will be injected before html head.
  headScripts: [],
  // The ordered scripts will be injected end of html body.
  bodyScripts: [],
  // `allowPx2rem` default is true
  viewport: viewportScripts,
  // avoid use cdn
  excludeCdnEnvs: [],
  // `minify` is true, `dev` always don't minify.
  htmlMinify: true,
  // Default use It must be an absolute path.
  templatePath: getPackageDir('templates/index.html'),
};

type Json =
  | undefined
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

export type HtmlPluginConfigConfigData = {
  mode: 'development' | 'production';
  /**
   * The random `cdn` for config via `env` template
   */
  envCdn: string;
};

export type HtmlPluginConfigTokenType<T extends Json> =
  | T
  | ((configData: HtmlPluginConfigConfigData) => T);

/**
 * 获取html plugin 模版相关定义字段.
 * @param preferredValue 用户首选的值, 如果返回为undefined, 将使用默认值
 * @returns
 */
export const getHtmlPluginConfig = <T extends Json>(
  key: keyof typeof defaultHtmlPluginConfig,
  configData: HtmlPluginConfigConfigData,
  preferredValue?: HtmlPluginConfigTokenType<T>
): T => {
  let userValue;
  if (typeof preferredValue !== 'undefined') {
    userValue =
      typeof preferredValue === 'function'
        ? preferredValue(configData)
        : preferredValue;
  }

  if (typeof userValue === 'undefined') {
    const defaultValue = defaultHtmlPluginConfig[key] as
      | T
      | ((configData: HtmlPluginConfigConfigData) => T);

    return typeof defaultValue === 'function'
      ? defaultValue(configData)
      : defaultValue;
  }

  return userValue as T;
};
