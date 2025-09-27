import HtmlWebpackPlugin from 'html-webpack-plugin';
import { basename } from 'node:path';
import { ensureSlash } from '@hyperse/hps-srv-common';
import type { Compiler } from '@rspack/core';
import rspack from '@rspack/core';
import { getRuntimeCDNBase } from '../../../helpers/helper-get-runtime-cdn-base.js';
import { httpUrlJoin } from '../../../helpers/helper-script-injects.js';
import type { EntryMapItem } from '../../../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../../../types/types-options.js';

export class EvolveCdnPlugin {
  private pluginName = 'EvolveCdnPlugin';
  // https://github.com/webpack/webpack/blob/3d653290fafe385277b48e5a36807124618b9561/lib/MainTemplate.js#L12
  // the bundle public path RuntimeGlobals.publicPath: '__webpack_require__.p';
  private requireFn = rspack.RuntimeGlobals.publicPath;

  private htmlCdn: string;
  private entryMapItemList: EntryMapItem[];

  constructor(
    evolveOptions: HpsEvolveOptions,
    entryMapItemList: EntryMapItem[]
  ) {
    this.htmlCdn = evolveOptions.rspack.plugins.htmlPlugin.htmlCdn;
    this.entryMapItemList = entryMapItemList;

    // Make sure we have `prod` configuration for each cdn node at least.
    if (!this.htmlCdn) {
      throw new Error('We must setup `htmlCdn`!');
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
            '// Dynamic assets path override(`@hyperse/hps-srv-rspack`) plugin-html-cdn`)'
          );
          buf.push(getRuntimeCDNBase(this.htmlCdn, this.requireFn));
          if (module.source?.['source'])
            module.source['source'] = Buffer.from(buf.join('\n'), 'utf-8');
        }
      });
    });

    // Using html webpack plugin hooks to replace `scripts` `styles` before inject to html temlate file.
    compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(
        compilation as any
      ).beforeAssetTagGeneration.tap(this.pluginName, (data) => {
        const { assets, plugin, outputName } = data;

        const chunks = plugin?.options?.chunks || [];
        const currentChunk = Array.isArray(chunks)
          ? chunks.find((chunk) =>
              outputName.includes(ensureSlash(chunk, true))
            )
          : chunks;
        const { userOptions } = data.plugin as HtmlWebpackPlugin & {
          userOptions: {
            multiCdn: { disabled: boolean };
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
          return httpUrlJoin(this.htmlCdn, scriptItem.replace(publicPath, ''));
        });

        const styles = assertCssList.map((styleItem) => {
          // Normally for `index-dev.html`  we need to use relative path.
          if (multiCdn.disabled) {
            return basename(styleItem);
          }
          return httpUrlJoin(this.htmlCdn, styleItem.replace(publicPath, ''));
        });
        data.assets.js = scripts;
        data.assets.css = styles;
        return data;
      });

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
