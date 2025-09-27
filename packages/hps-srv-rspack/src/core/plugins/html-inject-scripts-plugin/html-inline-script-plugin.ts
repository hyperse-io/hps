import type { HtmlTagObject } from 'html-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import {
  Compilation,
  type Compiler,
  type RspackPluginInstance,
} from '@rspack/core';

const PLUGIN_PREFIX = `HtmlInlineScriptRspackPlugin`;

/**
 * https://github.com/icelam/html-inline-script-webpack-plugin/blob/master/src/HtmlInlineScriptPlugin.ts
 */
export class HtmlInlineScriptRspackPlugin implements RspackPluginInstance {
  tests: RegExp[];

  constructor(tests?: RegExp[]) {
    this.tests = tests || [/.+\.js$/];
  }

  isFileNeedsToBeInlined(assetName: string): boolean {
    return this.tests.some((test) => test.exec(assetName));
  }

  processScriptTag(
    publicPath: string,
    assets: Compilation['assets'],
    tag: HtmlTagObject
  ): HtmlTagObject {
    if (tag.tagName !== 'script' || !tag.attributes?.src) {
      return tag;
    }

    const scriptName = (tag.attributes.src as string).replace(publicPath, '');

    if (!this.isFileNeedsToBeInlined(scriptName)) {
      return tag;
    }

    const asset = assets[scriptName];

    if (!tag) {
      return tag;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, ...attributesWithoutSrc } = tag.attributes;

    return {
      tagName: 'script',
      innerHTML: asset.source() as string,
      voidTag: false,
      attributes: attributesWithoutSrc,
      meta: { plugin: 'html-inline-script-webpack-plugin' },
    };
  }

  apply(compiler: Compiler): void {
    let publicPath = (compiler.options?.output?.publicPath as string) || '';

    if (publicPath && !publicPath.endsWith('/')) {
      publicPath += '/';
    }

    compiler.hooks.compilation.tap(
      `${PLUGIN_PREFIX}_compilation`,
      (compilation: Compilation) => {
        const hooks = htmlWebpackPlugin.getHooks(compilation as any);
        hooks.alterAssetTags.tap(`${PLUGIN_PREFIX}_alterAssetTags`, (data) => {
          data.assetTags.scripts = data.assetTags.scripts.map((tag) =>
            this.processScriptTag(publicPath, compilation.assets, tag)
          );
          return data;
        });

        compilation.hooks.processAssets.tap(
          {
            name: `${PLUGIN_PREFIX}_PROCESS_ASSETS_STAGE_SUMMARIZE`,
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          (assets) => {
            Object.keys(assets).forEach((assetName) => {
              if (this.isFileNeedsToBeInlined(assetName)) {
                delete assets[assetName];
              }
            });
          }
        );
      }
    );
  }
}
