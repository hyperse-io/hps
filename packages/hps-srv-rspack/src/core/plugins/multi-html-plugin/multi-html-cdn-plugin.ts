import HtmlWebpackPlugin from 'html-webpack-plugin';
import { basename } from 'node:path';
import { ensureSlash } from '@hyperse/hps-srv-common';
import type { Compiler } from '@rspack/core';
import rspack from '@rspack/core';
import { getRuntimeCDNBase } from '../../../helpers/get-runtime-cdn-base.js';
import {
  findEnvCdn,
  httpUrlJoin,
} from '../../../helpers/helper-script-injects.js';
import type { EntryMapItem } from '../../../types/types-entry-map.js';
import {
  type EvolveMultiCDNConfig,
  type EvolveMultiCDNEnvResolver,
  type EvolveMultiCdnEnvType,
} from '../../../types/types-multi-html.js';
import type { HpsEvolveOptions } from '../../../types/types-options.js';

export class FlatEvolveMultiCdnPlugin {
  private pluginName = 'FlatEvolveMultiCdnPlugin';
  // https://github.com/webpack/webpack/blob/3d653290fafe385277b48e5a36807124618b9561/lib/MainTemplate.js#L12
  // the bundle public path RuntimeGlobals.publicPath: '__webpack_require__.p';
  private requireFn = rspack.RuntimeGlobals.publicPath;

  private config: EvolveMultiCDNConfig;
  private cdnResolver: EvolveMultiCDNEnvResolver;
  private entryMapItemList: EntryMapItem[];

  constructor(
    evolveOptions: HpsEvolveOptions,
    entryMapItemList: EntryMapItem[]
  ) {
    this.config = evolveOptions.multiHtmlCdn;
    this.entryMapItemList = entryMapItemList;
    this.cdnResolver =
      evolveOptions.multiHtmlCdnEnvResolver ||
      function cdnResolver() {
        return undefined;
      };

    // Make sure we have `prod` configuration for each cdn node at least.
    if (!this.config?.prod) {
      throw new Error('We must setup `prod` for each CDN config node!');
    }
  }

  /**
   * Apply the plugin to check if there are non initial chunks which need to be imported using `require-ensure` or `import`
   * https://github.com/webpack/webpack/blob/3d653290fafe385277b48e5a36807124618b9561/lib/MainTemplate.js#L158
   * https://www.npmjs.com/package/vscode-webpack-debugger
   * https://www.cnblogs.com/Scar007/p/9166068.html
   * https://www.cnblogs.com/pluslius/p/10271537.html
   */
  apply(compiler: Compiler): void {
    // Handle chunk assets while  `Compilation:before-chunk-assets`
    // https://github.com/webpack/webpack/blob/3d653290fafe385277b48e5a36807124618b9561/lib/MainTemplate.js#L58
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      compilation.hooks.runtimeModule.tap(this.pluginName, (module, chunk) => {
        const findEntryMapItem = this.entryMapItemList.find(
          (item) => item[0] === chunk.name
        );

        if (module.name === 'public_path' && findEntryMapItem) {
          const buf: string[] = [];
          buf.push('\n');
          buf.push(
            '// Dynamic assets path override(`@flatjs/evolve`) plugin-multi-html-cdn`)'
          );
          buf.push(
            getRuntimeCDNBase(this.config, this.cdnResolver, this.requireFn)
          );
          module.source['source'] = Buffer.from(buf.join('\n'), 'utf-8');
        }
      });
    });

    // Using html webpack plugin hooks to replace `scripts` `styles` before inject to html temlate file.
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tap(
        this.pluginName,
        (data) => {
          const { assets, plugin, outputName } = data;

          const chunks = plugin?.options?.chunks || [];
          const currentChunk = Array.isArray(chunks)
            ? chunks.find((chunk) =>
                outputName.includes(ensureSlash(chunk, true))
              )
            : chunks;
          const { userOptions } = data.plugin as HtmlWebpackPlugin & {
            userOptions: {
              multiCdn: { env: EvolveMultiCdnEnvType; disabled: boolean };
            };
          };

          if (!currentChunk) {
            throw new Error('We must have current chunk!');
          }

          const assertJsList = assets.js.filter((jsPath) =>
            jsPath.includes(ensureSlash(currentChunk, true))
          );

          const assertCssList = assets.css.filter((jsPath) =>
            jsPath.includes(ensureSlash(currentChunk, true))
          );

          const multiCdn = userOptions.multiCdn;
          const publicPath = assets.publicPath;
          const scripts = assertJsList.map((scriptItem) => {
            // Normally for `index-dev.html`  we need to use relative path.
            if (multiCdn.disabled) {
              return basename(scriptItem);
            }
            const randomCdn = findEnvCdn(this.config, multiCdn.env);
            return httpUrlJoin(randomCdn, scriptItem.replace(publicPath, ''));
          });

          const styles = assertCssList.map((styleItem) => {
            // Normally for `index-dev.html`  we need to use relative path.
            if (multiCdn.disabled) {
              return basename(styleItem);
            }
            const randomCdn = findEnvCdn(this.config, multiCdn.env);
            return httpUrlJoin(randomCdn, styleItem.replace(publicPath, ''));
          });
          data.assets.js = scripts;
          data.assets.css = styles;
          return data;
        }
      );

      // Remove html assets if output.library is configured
      compilation.hooks.processAssets.tap(
        {
          name: this.pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets) => {
          if (compiler.options.output.library) {
            for (const name of Object.keys(assets)) {
              if (name.endsWith('.html')) {
                delete compilation.assets[name];
              }
            }
          }
        }
      );
    });
  }
}
