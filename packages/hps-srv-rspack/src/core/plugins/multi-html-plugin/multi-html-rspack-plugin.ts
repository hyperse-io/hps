import HtmlWebpackPlugin from 'html-webpack-plugin';
import { existsSync } from 'node:fs';
import { logger, requireResolve } from '@hyperse/hps-srv-common';
import type { Plugin as RspackPlugin } from '@rspack/core';
import { getHtmlMinOrder } from '../../../helpers/helper-get-html-max-order.js';
import { getHtmlPluginConfig } from '../../../helpers/helper-get-html-plugin-config.js';
import { normalizeTemplateInjectTokens } from '../../../helpers/helper-normalize-template-inject-tokens.js';
import { findEnvCdn } from '../../../helpers/helper-script-injects.js';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import {
  type EvolveMultiCdnEnvType,
  type HtmlPluginConfigConfigData,
} from '../../../types/types-multi-html.js';
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
  entryMapItemList: EntryMapItem[],
  allEnv: Array<EvolveMultiCdnEnvType>
): RspackPlugin[] => {
  const firstEntryMap = entryMapItemList[0];
  const [, entryConfig] = firstEntryMap;
  const htmlPlugins: RspackPlugin[] = [
    new MultiHtmlModifyPlugin(entryMapItemList),
  ];
  const { options } = entryConfig;
  const mode = serveMode ? 'development' : 'production';
  const chunks: string[] = entryMapItemList.map((entryMap) => entryMap[0]);
  for (const env of allEnv) {
    const envCdn = findEnvCdn(evolveOptions.multiHtmlCdn, env);
    const configData: HtmlPluginConfigConfigData = {
      mode,
      envCdn,
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
    ).replace(`{0}`, env.trim());

    if (!existsSync(templatePath)) {
      logger.warn(
        `The template file ${templatePath} is not exists, use \`prod\` instead!`
      );
      templatePath = getHtmlPluginConfig<string>(
        'templatePath',
        configData,
        options?.templatePath
      ).replace(`{0}`, 'prod');
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
        minify:
          options?.htmlMinify === false || ['me', 'dev'].includes(env)
            ? false
            : minifyOpts,
        // output file path
        filename: (entryName) =>
          `${entryName}/index${env === 'prod' ? '' : `-${env}`}.html`,
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
          env,
          // use relative path for `me`, `dev`, `ntv`
          disabled: (options?.excludeCdnEnvs || ['me', 'dev', 'ntv']).includes(
            env
          ),
        },
      }) as unknown as RspackPlugin
    );
  }

  return htmlPlugins;
};
