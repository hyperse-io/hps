import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPackageDir, urlJoin } from '@hyperse/hps-srv-common';
import { parseTemplate } from '@hyperse/html-webpack-plugin-loader';
import { normalizePageProxy } from '../../helpers/helper-normalize-page-proxy.js';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import {
  getSortedModules,
  type SortedModuleItem,
} from './get-all-sorted-modules.js';

export interface MainTemplateModuleItemData {
  name: string;
  link: string;
  flagText: string;
  isServed: 1 | 0;
}

export interface MainTemplateData {
  title: string;
  modules: MainTemplateModuleItemData[];
}

export const getPageMainHtml = async (
  servedDevServerEntries: EvolveDevServerEntryMap,
  devHostUri: string,
  evolveOptions: HpsEvolveOptions
): Promise<string> => {
  const evolveCwd = getPackageDir(import.meta.url);
  const templateStr = readFileSync(
    join(evolveCwd, './templates/main/index.html'),
    'utf-8'
  );

  const sortedModules: SortedModuleItem[] = getSortedModules(
    evolveOptions,
    servedDevServerEntries,
    devHostUri
  );

  const pageProxy = normalizePageProxy(
    evolveOptions.devServer?.pageProxy || '/pages'
  );

  const templateModules = sortedModules.map((module) => {
    const { entryName, entryContent, isServedEntry, projectVirtualPath } =
      module;

    const linkHref = urlJoin(devHostUri, [pageProxy, entryName]);

    // Allow customized page main link.
    const servePageMainLinkFn =
      entryContent.options?.servePageMainLinkFn || ((link: string) => link);

    const link = servePageMainLinkFn(linkHref, {
      hostUri: devHostUri,
      entryName,
      virtualPath: projectVirtualPath,
    });

    const displayName = entryName
      .replace(projectVirtualPath, '')
      .replace(/^\//, '');

    return {
      link,
      name: displayName,
      flagText: isServedEntry ? 'serve' : 'static',
      isServed: isServedEntry ? 1 : 0,
    } satisfies MainTemplateModuleItemData;
  });

  // Add `runtime manifest` to the main page modules list
  templateModules.push({
    flagText: 'serve',
    isServed: 1,
    link: urlJoin(devHostUri, [pageProxy, '/runtime/manifest.json']),
    name: 'Runtime Manifest',
  });

  const templateData: MainTemplateData = {
    title: 'hps serve evolve',
    modules: templateModules.sort((a, b) => {
      return b.isServed - a.isServed;
    }),
  };

  const mainModuleParser = parseTemplate(templateStr);

  mainModuleParser.upsertHeadInlineScripts([
    {
      id: 'main-dashboard-data',
      order: 1,
      position: 'end',
      content: `window.HPS_MAIN_DASHBOARD_DATA = ${JSON.stringify(
        templateData
      )}`,
    },
  ]);

  mainModuleParser.upsertBodyScripts([
    {
      id: 'main-bundle.js',
      order: 1,
      position: 'end',
      src: urlJoin(devHostUri, ['/hps_dashboard_static/bundle.js']),
    },
  ]);

  mainModuleParser.upsertHeadStyles([
    {
      id: 'main-css.js',
      order: 1,
      position: 'end',
      href: urlJoin(devHostUri, ['/hps_dashboard_static/bundle.css']),
    },
  ]);

  return mainModuleParser.serialize();
};
