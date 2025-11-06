import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';
import { parseTemplate } from '@hyperse/html-webpack-plugin-loader';
import { normalizePageProxy } from '../../helpers/helper-normalize-page-proxy.js';
import type { HpsEvolveDevServerOptions } from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';

export const getStaticModuleHtml = async (
  staticPage: Required<HpsEvolveDevServerOptions>['staticPages'][number],
  devHostUri: string,
  evolveOptions: HpsEvolveOptions
): Promise<string> => {
  const { projectVirtualPath } = evolveOptions;
  const { htmlPath: moduleTemplate, entryName } = staticPage;

  if (!existsSync(moduleTemplate)) {
    return 'Not Found Static Page HTML Template Path: ' + moduleTemplate;
  }
  const templateStr = readFileSync(moduleTemplate, 'utf-8');

  const devServer = evolveOptions.devServer;
  const defaultGlobalData = devServer?.defaultServeGlobalData
    ? await devServer.defaultServeGlobalData(
        {
          entry: [moduleTemplate],
        },
        devHostUri
      )
    : {};

  const pageProxy = normalizePageProxy(devServer?.pageProxy || '/pages');

  const templateParser = parseTemplate(templateStr);

  // ===== Head Inline Scripts Configuration =====
  const headInlineScripts: TemplateOptions['headInlineScripts'] = [];

  // Add global data configuration
  const globalData = {
    hostUrl: devHostUri,
    virtualPath: join(pageProxy, projectVirtualPath),
    moduleName: entryName.replace(projectVirtualPath, '').replace(/^\//, ''),
    ...defaultGlobalData,
  };
  headInlineScripts.push({
    id: 'globalData',
    content: `window.GLOBAL=${JSON.stringify(globalData)}`,
    position: 'end',
    order: 1,
  });

  templateParser.upsertHeadInlineScripts(headInlineScripts);
  return templateParser.serialize();
};
