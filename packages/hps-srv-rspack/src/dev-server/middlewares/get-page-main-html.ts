import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPackageDir, urlJoin } from '@hyperse/hps-srv-common';
import { normalizePageProxy } from '../../helpers/helper-normalize-page-proxy.js';
import type { EvolveDevServerEntryMap } from '../../types/types-dev-server.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import {
  getSortedModules,
  type SortedModuleItem,
} from './get-all-sorted-modules.js';
import type {
  MainTemplateData,
  MainTemplateModuleItemData,
} from './main-module-parser.js';
import { MainModuleParser } from './main-module-parser.js';

export const getPageMainHtml = async (
  servedDevServerEntries: EvolveDevServerEntryMap,
  devHostUri: string,
  evolveOptions: HpsEvolveOptions
): Promise<string> => {
  const evolveCwd = getPackageDir(import.meta.url);
  const templateStr = readFileSync(
    join(evolveCwd, './templates/main.html'),
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
    const {
      entryName,
      entryContent,
      isServedEntry,
      projectVirtualPath,
      normalizedEntryName,
    } = module;

    const linkHref = urlJoin(devHostUri, [pageProxy, normalizedEntryName], {
      env: 'me',
    });

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
    title: '@hyperse/hps-srv-rspack',
    modules: templateModules.sort((a, b) => {
      return b.isServed - a.isServed;
    }),
  };

  const mainModuleParser = new MainModuleParser(templateStr, templateData);

  return mainModuleParser.serialize();
};
