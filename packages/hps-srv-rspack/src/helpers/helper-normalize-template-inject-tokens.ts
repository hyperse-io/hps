import _ from 'lodash';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { type EvolveEntryItemOption } from '../types/types-entry-map.js';
import {
  getHtmlPluginConfig,
  type HtmlPluginConfigConfigData,
} from './helper-get-html-plugin-config.js';

/**
 * Normalizes the template inject tokens based on the provided configuration data and entry options.
 *
 * @param configData - The configuration data for the HTML plugin.
 * @param currEntryOption - The current entry option for the evolve item.
 * @returns An object containing the normalized template inject tokens.
 */
export const normalizeTemplateInjectTokens = (
  configData: HtmlPluginConfigConfigData,
  currEntryOption?: EvolveEntryItemOption
): {
  favicon?: TemplateOptions['favicon'];
  headMetaTags?: TemplateOptions['headMetaTags'];
  headStyles?: TemplateOptions['headStyles'];
  headScripts: TemplateOptions['headScripts'];
  bodyScripts: TemplateOptions['bodyScripts'];
  headInlineScripts?: TemplateOptions['headInlineScripts'];
  headInlineStyles?: TemplateOptions['headInlineStyles'];
} => {
  const tokens = {
    // The page favicon
    favicon: getHtmlPluginConfig(
      'favicon',
      configData,
      currEntryOption?.favicon
    ),
    // The customized html tags should be inject to <header />
    headMetaTags: getHtmlPluginConfig(
      'headMetaTags',
      configData,
      currEntryOption?.headMetaTags
    ),

    // Allow us customized inline scripts into compiled html template.
    headInlineScripts: getHtmlPluginConfig(
      'headInlineScripts',
      configData,
      currEntryOption?.headInlineScripts
    ),

    // The ordered styles will be injected start of html head.
    headStyles: getHtmlPluginConfig(
      'headStyles',
      configData,
      currEntryOption?.headStyles
    ),

    // The ordered scripts will be injected before html head.
    headScripts: getHtmlPluginConfig(
      'headScripts',
      configData,
      currEntryOption?.headScripts
    ),

    // The ordered scripts will be injected end of html body.
    bodyScripts: getHtmlPluginConfig(
      'bodyScripts',
      configData,
      currEntryOption?.bodyScripts
    ),

    // The ordered styles will be injected start of html head.
    headInlineStyles: getHtmlPluginConfig(
      'headInlineStyles',
      configData,
      currEntryOption?.headInlineStyles
    ),
  };

  return _.cloneDeep(tokens);
};
