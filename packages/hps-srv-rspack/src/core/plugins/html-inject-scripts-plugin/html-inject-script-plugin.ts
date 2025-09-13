import type { HtmlTagObject } from 'html-webpack-plugin';
import htmlWebpackPlugin from 'html-webpack-plugin';
import { type Compiler, type RspackPluginInstance } from '@rspack/core';

const PLUGIN_PREFIX = `HtmlInjectScriptPlugin`;

export class HtmlInjectScriptPlugin implements RspackPluginInstance {
  scripts: string[];
  constructor(scripts?: string[]) {
    this.scripts = scripts || [];
  }

  processScripts(): HtmlTagObject[] {
    const scripts: HtmlTagObject[] = this.scripts
      .filter(Boolean)
      .map((asset) => {
        return {
          tagName: 'script',
          innerHTML: asset,
          voidTag: false,
          attributes: {},
          meta: { plugin: 'html-inject-script-rspack-plugin' },
        };
      });
    return scripts;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(
      `${PLUGIN_PREFIX}_compilation`,
      (compilation) => {
        const hooks = htmlWebpackPlugin.getHooks(compilation);
        hooks.alterAssetTags.tap(`${PLUGIN_PREFIX}_alterAssetTags`, (data) => {
          data.assetTags.scripts.unshift(...this.processScripts());
          return data;
        });
      }
    );
  }
}
