import { type Request } from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { ensureSlash, getPackageDir, urlJoin } from '@hyperse/hps-srv-common';
import { parseTemplate } from '@hyperse/html-webpack-plugin-loader';
import { allowPx2remForModule } from '../../helpers/helper-allow-px2rem-for-module.js';
import {
  getHtmlMaxOrder,
  getHtmlMinOrder,
} from '../../helpers/helper-get-html-max-order.js';
import { getHtmlPluginConfig } from '../../helpers/helper-get-html-plugin-config.js';
import { getRuntimeCDNBase } from '../../helpers/helper-get-runtime-cdn-base.js';
import { normalizeEvolveEntryName } from '../../helpers/helper-normalize-entry-map.js';
import { normalizePageProxy } from '../../helpers/helper-normalize-page-proxy.js';
import { normalizeTemplateInjectTokens } from '../../helpers/helper-normalize-template-inject-tokens.js';
import { injectFederationScripts } from '../../helpers/helper-script-injects.js';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import type { HtmlPluginConfigConfigData } from '../../types/types-multi-html.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { ErrorModuleParser } from './error-module-parser.js';
import { getBundleAsset } from './get-bundle-asset.js';
import { getDevServerHostUri } from './get-dev-server-host-uri.js';
import { getHmrRuntimeChunks } from './get-hmr-runtime-chunks.js';
import { getNormalizedEntryName } from './get-normalized-entry-name.js';

export const getPageModuleHtml = async (
  servedDevServerEntries: EvolveDevServerEntryMap,
  req: Request,
  devHostUri: string,
  apiContext: string,
  evolveOptions: HpsEvolveOptions
): Promise<string> => {
  const { entryMap, projectVirtualPath } = evolveOptions;
  // Sort entry names by length in descending order to match the longest path first
  const entryNames = Object.keys(entryMap).sort((a, b) => b.length - a.length);
  const evolveCwd = getPackageDir(import.meta.url);

  // Find the matching entry name by comparing normalized paths
  const currEntryName = entryNames.find((entryName) => {
    const normalizedEntryName = entryName.replace(/^\//, '');

    return ensureSlash(req.path.replace(/^\//, ''), true).startsWith(
      ensureSlash(normalizedEntryName, true)
    );
  });

  if (!currEntryName) {
    const notFoundTemplateStr = readFileSync(
      join(evolveCwd, `./templates/module-404.html`),
      'utf-8'
    );
    const errorModuleParser = new ErrorModuleParser(notFoundTemplateStr, {
      title: '404 Not Found',
      errorMeta: [
        {
          name: `@hyperse/hps-srv-rspack workspace`,
          value: evolveCwd,
        },
        {
          name: `served entry names`,
          value: JSON.stringify(entryNames),
        },

        { name: `module path`, value: `${req.path}` },
      ],
    });
    return errorModuleParser.serialize();
  }

  const currEntryItem = entryMap[currEntryName];
  const currEntryOption = currEntryItem.options;

  const devServerHostUri = getDevServerHostUri(
    servedDevServerEntries,
    currEntryName,
    devHostUri
  );

  const moduleTemplate =
    currEntryOption?.templatePath || './templates/module.html';
  const projectHostedModuleTemplate = join(
    evolveOptions.projectCwd,
    './templates/module.html'
  );
  const templateStr = readFileSync(
    isAbsolute(moduleTemplate)
      ? moduleTemplate
      : existsSync(projectHostedModuleTemplate)
        ? projectHostedModuleTemplate
        : join(evolveCwd, './templates/module.html'),
    'utf-8'
  );

  const devServer = evolveOptions.devServer;
  const defaultGlobalData = devServer?.defaultServeGlobalData
    ? await devServer.defaultServeGlobalData(currEntryItem, devHostUri)
    : {};

  const configData: HtmlPluginConfigConfigData = {
    mode: 'development',
    // FIXME: always use `devHostUri` as served local `cdn`, if you want to serve `anther` module
    // you need to generate cdn path manually.
    envCdn: urlJoin(devHostUri, ['public']),
  };

  const normalizedEntryName = getNormalizedEntryName(
    currEntryName,
    projectVirtualPath,
    servedDevServerEntries,
    devServer
  );

  const pageProxy = normalizePageProxy(devServer?.pageProxy || '/pages');

  const templateInjectTokens = normalizeTemplateInjectTokens(
    configData,
    currEntryOption
  );

  const templateParser = parseTemplate(templateStr);

  // ===== Page Title Configuration =====
  templateParser.upsertTitleTag(
    getHtmlPluginConfig('title', configData, currEntryOption?.title)
  );

  // ===== Favicon Configuration =====
  const favicon = templateInjectTokens.favicon;
  if (favicon) {
    templateParser.upsertFaviconTag(
      favicon.href,
      favicon.rel,
      favicon.attributes
    );
  }

  // ===== Head Meta Configuration =====
  const headMetaTags = templateInjectTokens.headMetaTags || [];
  templateParser.upsertHeadMetaTags(headMetaTags);

  // ===== Head Styles Configuration =====
  const headStyles = templateInjectTokens.headStyles || [];
  const headStylesMaxOrder = getHtmlMaxOrder(headStyles);
  const assetStyles = getBundleAsset(
    devServerHostUri,
    normalizedEntryName,
    '.css'
  );
  headStyles.push({
    id: assetStyles,
    href: assetStyles,
    position: 'end',
    order: headStylesMaxOrder + 1,
  });
  templateParser.upsertHeadStyles(headStyles);

  // ===== Head Scripts Configuration =====
  const headScripts = templateInjectTokens.headScripts || [];
  const headScriptsMaxOrder = getHtmlMaxOrder(headScripts);
  const headScriptsMinOrder = getHtmlMinOrder(headScripts);

  // Add HMR runtime chunks for hot reloading
  const devRuntimeChunks = getHmrRuntimeChunks(
    servedDevServerEntries,
    currEntryName,
    normalizedEntryName,
    currEntryItem,
    evolveOptions,
    devServerHostUri
  );

  devRuntimeChunks.forEach((runtimeChunk) => {
    headScripts.unshift({
      id: runtimeChunk,
      src: runtimeChunk,
      position: 'end',
      order: headScriptsMaxOrder - 1,
    });
  });

  templateParser.upsertHeadScripts(headScripts);

  // ===== Head Inline Scripts Configuration =====
  const headInlineScripts = templateInjectTokens.headInlineScripts || [];
  const headInlineScriptsMaxOrder = getHtmlMaxOrder(headInlineScripts);
  const headInlineScriptsMinOrder = getHtmlMinOrder(headInlineScripts);
  const minOrder = Math.min(headInlineScriptsMinOrder, headScriptsMinOrder);

  // Add global data configuration
  const globalData = {
    hostUrl: devHostUri,
    apiBase: urlJoin(devHostUri, [apiContext]),
    virtualPath: join(pageProxy, projectVirtualPath),
    moduleName: currEntryName
      .replace(projectVirtualPath, '')
      .replace(/^\//, ''),
    ...defaultGlobalData,
    ...(currEntryOption?.serveGlobalData || {}),
  };
  headInlineScripts.push({
    id: 'globalData',
    content: `window.GLOBAL=${JSON.stringify(globalData)}`,
    position: 'end',
    order: minOrder - 2,
  });

  // Add viewport meta tag if px2rem is enabled for the module
  if (allowPx2remForModule([currEntryName, currEntryItem], evolveOptions)) {
    headInlineScripts.push({
      id: 'viewport',
      content: getHtmlPluginConfig(
        'viewport',
        configData,
        currEntryOption?.viewport
      ),
      position: 'end',
      order: headInlineScriptsMinOrder - 1,
    });
  }

  // Add runtime CDN base configuration
  const runtimeCDNBaseScript = getRuntimeCDNBase(evolveOptions.htmlCdn);
  headInlineScripts.push({
    id: 'hpsMultiCdn',
    content: runtimeCDNBaseScript,
    position: 'end',
    order: headInlineScriptsMaxOrder + 1,
  });

  // Add Module Federation scripts for static mode
  const moduleFederationScripts = injectFederationScripts(
    evolveOptions.htmlCdn
  );
  headInlineScripts.push({
    id: 'evolveFetchMicroWidgets',
    content: moduleFederationScripts,
    position: 'end',
    order: headInlineScriptsMaxOrder + 2,
  });

  templateParser.upsertHeadInlineScripts(headInlineScripts);

  // ===== Head Inline Styles Configuration =====
  const headInlineStyles = templateInjectTokens.headInlineStyles || [];
  templateParser.upsertHeadInlineStyles(headInlineStyles);

  // ===== Body Scripts Configuration =====
  const bodyScripts = templateInjectTokens.bodyScripts || [];
  const bodyScriptsMaxOrder = getHtmlMaxOrder(bodyScripts);
  const bundleScript = getBundleAsset(
    devServerHostUri,
    normalizedEntryName,
    '.js'
  );
  bodyScripts.push({
    id: bundleScript,
    src: bundleScript,
    position: 'end',
    order: bodyScriptsMaxOrder + 1,
  });
  templateParser.upsertBodyScripts(bodyScripts);

  return templateParser.serialize();
};
