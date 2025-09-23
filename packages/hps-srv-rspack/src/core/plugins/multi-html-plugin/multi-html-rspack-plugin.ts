import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync } from 'node:fs';
import { logger, requireResolve } from '@hyperse/hps-srv-common';
import type { Plugin as RspackPlugin } from '@rspack/core';
import { allowPx2remForModule } from '../../../helpers/helper-allow-px2rem-for-module.js';
import { getHtmlMinOrder } from '../../../helpers/helper-get-html-max-order.js';
import { getHtmlPluginConfig } from '../../../helpers/helper-get-html-plugin-config.js';
import { normalizeTemplateInjectTokens } from '../../../helpers/helper-normalize-template-inject-tokens.js';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import { type HtmlPluginConfigConfigData } from '../../../types/types-multi-html.js';
import { type HpsEvolveOptions } from '../../../types/types-options.js';
import { MultiHtmlModifyPlugin } from './multi-html-modify-plugin.js';

const minifyOpts = {
  minifyJS: true,
  removeComments: true,
  collapseWhitespace: true,
  collapseBooleanAttributes: false,
};

/**
 * Create `html-webpack-plugin` for this build, refer to best practices
 * We'd better pass only one entry for each `build` cycle
 * @param buildEntryItem the entries for this `build`
 * @param allEnv
 */
export const createMultiHtmlRspackPlugins = (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions,
  entryMapItemList: EntryMapItem[]
): RspackPlugin[] => {
  const firstEntryMap = entryMapItemList[0];
  const [, entryConfig] = firstEntryMap;
  const htmlPlugins: RspackPlugin[] = [
    new MultiHtmlModifyPlugin(entryMapItemList),
  ];
  const { options } = entryConfig;
  const mode = serveMode ? 'development' : 'production';
  const chunks: string[] = entryMapItemList.map((entryMap) => entryMap[0]);
  const htmlCdn = evolveOptions.rspack.plugins.multiHtmlPlugin.htmlCdn;
  const configData: HtmlPluginConfigConfigData = {
    mode,
    envCdn: htmlCdn,
  };
  const templateInjectTokens = normalizeTemplateInjectTokens(
    configData,
    options
  );

  const headInlineScripts = templateInjectTokens?.headInlineScripts || [];
  if (allowPx2remForModule(firstEntryMap, evolveOptions)) {
    const headInlineScriptsMinOrder = getHtmlMinOrder(headInlineScripts);
    const viewportScript = getHtmlPluginConfig(
      'viewport',
      configData,
      options?.viewport
    );
    headInlineScripts.push({
      id: 'viewport',
      content: viewportScript,
      position: 'end',
      order: headInlineScriptsMinOrder - 1,
    });
  }

  let templatePath = getHtmlPluginConfig<string>(
    'templatePath',
    configData,
    options?.templatePath
  );

  if (!existsSync(templatePath)) {
    logger.warn(
      `The template file ${templatePath} is not exists, use builtin template instead!`
    );
    templatePath = getHtmlPluginConfig<string>(
      'templatePath',
      configData,
      options?.templatePath
    );
  }

  const loader = requireResolve(
    import.meta.url,
    '@hyperse/html-webpack-plugin-loader/loader'
  );

  templatePath = `${loader}!${templatePath}`;

  htmlPlugins.push(
    new HtmlWebpackPlugin({
      inject: 'body',
      title: getHtmlPluginConfig('title', configData, options?.title),
      chunks: chunks,
      // `minify` is true, `dev` always don't minify.
      minify: options?.htmlMinify === false ? false : minifyOpts,
      // output file path
      filename: (entryName) => `${entryName}/index.html`,
      // html template
      template: templatePath,
      // template parameters
      templateParameters: {
        // The page title
        title: '',
        ...templateInjectTokens,
        headInlineScripts,
      },
      // Some options for plugin used the `hook` of `html-webpack-plugin`
      multiCdn: {
        // use relative path for `me`, `dev`, `ntv`
        disabled: options?.cdnDisabled,
      },
    }) as unknown as RspackPlugin
  );

  return htmlPlugins;
};
