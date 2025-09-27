import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ensureSlash } from '@hyperse/hps-srv-common';
import { parseTemplate } from '@hyperse/html-webpack-plugin-loader';
import type { Compiler } from '@rspack/core';
import type {
  EntryMapItem,
  EvolveEntryItemOption,
} from '../../../types/types-entry-map.js';

const getCurrentEntryOptions = (
  entryMapItemList: EntryMapItem[] = [],
  outputName: string
): EvolveEntryItemOption | undefined => {
  const currentEntry = entryMapItemList.find((item) =>
    outputName.includes(ensureSlash(item[0], true))
  );
  return currentEntry ? currentEntry[1]?.options : undefined;
};

/**
 * The HtmlModifyPlugin class is responsible for modifying the HTML output of the webpack compiler.
 * It hooks into the compilation process and replaces occurrences of "<%= title %>" with the title specified in the options.
 */
export class HtmlModifyPlugin {
  private pluginName = 'HtmlModifyPlugin';
  private entryMapItemList: EntryMapItem[];
  constructor(list: EntryMapItem[]) {
    this.entryMapItemList = list;
  }
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(this.pluginName, (compiler) => {
      const hooks = HtmlWebpackPlugin.getHooks(compiler as any);
      hooks.beforeEmit.tapAsync(this.pluginName, (data, cb) => {
        const entryItemOption = getCurrentEntryOptions(
          this.entryMapItemList,
          data.outputName
        );
        const parserHtml = parseTemplate(data.html, {
          title: entryItemOption?.title || '',
        });
        cb(null, {
          ...data,
          html: parserHtml.serialize(),
        });
      });
    });
  }
}
