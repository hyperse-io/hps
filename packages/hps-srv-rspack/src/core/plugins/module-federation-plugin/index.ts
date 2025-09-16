import { join } from 'node:path';
import { ensureSlash } from '@hyperse/hps-srv-common';
import type { Plugins } from '@rspack/core';
import rspack from '@rspack/core';
import { normalizeEvolveEntryName } from '../../../helpers/helper-normalize-entry-map.js';
import { injectFederationScripts } from '../../../helpers/helper-script-injects.js';
import { type EntryMapItem } from '../../../types/types-entry-map.js';
import { type ExposesObject } from '../../../types/types-federation.js';
import { type HpsEvolveOptions } from '../../../types/types-options.js';
import { HtmlInjectScriptPlugin } from '../html-inject-scripts-plugin/html-inject-script-plugin.js';
import { ExternalTemplateRemotesPlugin } from './external-template-remotes-plugin.js';

/**
 * `${projectVirtualPath}/mine` --> evolve_demo_mine
 * @param entryPath `${projectVirtualPath}/mine`
 */
const normalizeWidgetName = (entryPath = '') => {
  return entryPath.replace(/[/-]/g, '_').toLowerCase();
};

const remoteFileName = (entryName: string) => {
  return join(entryName, `micro-remote-module.js`);
};

export const createModuleFederationPlugins = (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
) => {
  const projectVirtualPath = evolveOptions.projectVirtualPath;
  const plugins: Plugins = [];

  for (const entryMapItem of entryMapItemList) {
    const [entryName, entryConfig] = entryMapItem;
    const moduleFederation = entryConfig.options?.moduleFederation;
    if (moduleFederation) {
      const { remotes, exposes, ...restFederationOptions } = moduleFederation;
      // e.g. `hps/evolve/mine` => `hps/evolve/home/micro-remote-module.js`
      const entryRemoteFileName = remoteFileName(entryName);
      // e.g. `hps/evolve/mine` => `hps_evolve_mine`
      const containerName = normalizeWidgetName(entryName);

      const patchExposes: ExposesObject[] = exposes
        ? Array.isArray(exposes)
          ? exposes
          : [exposes]
        : [];

      const myExposes = patchExposes.map((s) => {
        const exposeItem: ExposesObject = {};
        for (const [key, config] of Object.entries(s)) {
          exposeItem[key] = {
            ...config,
            name: join(entryName, config.name.replace(/^\//, '')),
          };
        }
        return exposeItem;
      });

      const myRemotes = (remotes || []).map(({ name, endpoint }) => {
        // e.g. `hps/evolve/home`
        const normalizedEntryName = normalizeEvolveEntryName(
          name,
          projectVirtualPath
        );
        // e.g. `hps_evolve_home`
        const remoteWidgetName = normalizeWidgetName(normalizedEntryName);
        // e.g. `hps/evolve/home/micro-remote-module.js`
        const refRemoteEntryFileName = remoteFileName(normalizedEntryName);
        // construct endpoint for remote widget name.
        const endpointPath = endpoint
          ? ensureSlash(endpoint(name, normalizedEntryName), false)
          : `[window.evolveFetchMicroWidgets()]`;
        return {
          [remoteWidgetName]: `${remoteWidgetName}@${endpointPath}/${refRemoteEntryFileName}`,
        };
      });

      plugins.push(
        // https://webpack.js.org/plugins/module-federation-plugin/
        new rspack.container.ModuleFederationPlugin({
          /**
           * Options for library.
           * library: { type: 'var', name: containerName },
           * other module federation configurations
           */
          ...restFederationOptions,
          /**
           * The name of the container
           * `${projectName}-${moduleName}` e.g. `hps_evolve_home`
           */
          name: containerName,
          /**
           * The filename of the container as relative path inside the `output.path` directory.
           * `${entryName}/micro-remote-module.js`, e.g. `hps/evolve/home/micro-remote-module.js`
           */
          filename: entryRemoteFileName,
          /**
           * Container locations and request scopes from which modules should be resolved and loaded at runtime.
           * When provided, property name is used as request scope, otherwise request scope is automatically inferred from container location.
           */
          remotes: myRemotes,
          /**
           * Modules that should be exposed by this container.
           * When provided, property name is used as public name, otherwise public name is automatically inferred from request.
           */
          exposes: myExposes,
        }),
        new ExternalTemplateRemotesPlugin()
      );

      if (!serveMode) {
        plugins.unshift(
          new HtmlInjectScriptPlugin([
            injectFederationScripts(evolveOptions.htmlCdn),
          ])
        );
      }
    }
  }

  return plugins;
};
