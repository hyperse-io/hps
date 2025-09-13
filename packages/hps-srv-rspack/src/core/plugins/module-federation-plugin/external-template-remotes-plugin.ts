import type { Compiler, ExternalModule, Module } from '@rspack/core';
import { Compilation, sources } from '@rspack/core';
const { RawSource } = sources;

const PLUGIN_NAME = 'ExternalTemplateRemotesRspackPlugin';

const isExternalModule = (module: Module): module is ExternalModule => {
  return module.constructor.name === 'ExternalModule';
};

function extractUrlAndGlobal(urlAndGlobal: string) {
  const index = urlAndGlobal.indexOf('@');
  if (index <= 0 || index === urlAndGlobal.length - 1) {
    throw new Error(`Invalid request "${urlAndGlobal}"`);
  }
  return [urlAndGlobal.substring(index + 1), urlAndGlobal.substring(0, index)];
}

export class ExternalTemplateRemotesPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      const scriptExternalModules: ExternalModule[] = [];

      compilation.hooks.buildModule.tap(PLUGIN_NAME, (module) => {
        const isExternalScriptModule = module
          .identifier()
          .startsWith('external script');
        if (isExternalModule(module) && isExternalScriptModule) {
          scriptExternalModules.push(module);
        }
      });

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          scriptExternalModules.forEach((module) => {
            // get remoteEntry file name
            // eg: 'external script "flatjs_evolve_home@[window.evolveFetchMicroWidgets()]/flatjs/evolve/home/micro-remote-module.js"'
            // Use regex to extract the part between double quotes
            const originalStr = module.identifier();
            const originalStrList = originalStr.match(/"([^"]+)"/);
            const externalScript = originalStrList ? originalStrList[1] : '';
            const [urlTemplate] = extractUrlAndGlobal(externalScript);
            const urlExpression = toExpression(urlTemplate);

            // iterate all assets, find the js file that contains remoteEntry
            for (const assetName of Object.keys(assets)) {
              const asset = compilation.getAsset(assetName);
              const originalSource = asset?.source.source()?.toString();
              if (originalSource && originalSource.includes(urlTemplate)) {
                const replaced = originalSource.replace(
                  `"${urlTemplate}"`,
                  urlExpression
                );
                compilation.updateAsset(assetName, new RawSource(replaced));
              }
            }
          });
        }
      );
    });
  }
}

/**
 * app2@localhost/remoteEntry.js --> "\"app2@localhost/remoteEntry.js\""
 * app2@[window.app2Url]/remoteEntry.js --> "\"app2@\" + window.app2Url + \"/remoteEntry.js\""
 * @param templateUrl
 * @returns
 */
function toExpression(templateUrl: string) {
  const result: string[] = [];
  const current: string[] = [];
  let isExpression = false;
  let invalid = false;
  for (const c of templateUrl) {
    if (c === '[') {
      if (isExpression) {
        invalid = true;
        break;
      }
      isExpression = true;
      if (current.length) {
        result.push(`"${current.join('')}"`);
        current.length = 0;
      }
    } else if (c === ']') {
      if (!isExpression) {
        invalid = true;
        break;
      }
      isExpression = false;
      if (current.length) {
        result.push(`${current.join('')}`);
        current.length = 0;
      }
      current.length = 0;
    } else {
      current.push(c);
    }
  }
  if (isExpression || invalid) {
    throw new Error(`Invalid template URL "${templateUrl}"`);
  }
  if (current.length) {
    result.push(`"${current.join('')}"`);
  }
  return result.join(' + ');
}
