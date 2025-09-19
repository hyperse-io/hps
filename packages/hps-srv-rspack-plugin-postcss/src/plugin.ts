import {
  type AtRule,
  type Container,
  type Declaration,
  type Plugin,
  type PluginCreator,
  type Root,
} from 'postcss';
import { mergeOptions } from '@hyperse/hps-srv-common';
import { pluginName } from './constants.js';
import { defaultOpts } from './default-options.js';
import {
  blacklistedProp,
  blacklistedSelector,
  createPxReplace,
  handleIgnoreIdentifierRegex,
  passedWhiteListProp,
} from './pixel-util.js';
import { type PostcssPluginPixelOptions } from './types.js';

const declarationExists = (decls: Container, prop: string, value: string) => {
  return decls.some((decl) => {
    if (decl.type === 'decl') {
      return decl.prop === prop && decl.value === value;
    }
    return false;
  });
};

const postcssPluginPixel: PluginCreator<Partial<PostcssPluginPixelOptions>> = (
  options
): Plugin => {
  const pluginOptions = mergeOptions<Required<PostcssPluginPixelOptions>>(
    defaultOpts,
    options || {}
  );
  const unit = Object.keys(pluginOptions.rootValue).join('|');
  const regText = `"[^"]+"|'[^']+'|url\\([^\\)]+\\)|(\\d*\\.?\\d+)(${unit})`;
  let pxRegex = new RegExp(regText, 'gi');
  let identifier = pluginOptions.ignoreIdentifier;
  if (identifier) {
    identifier = identifier.replace(/\s+/g, '');
    pluginOptions.replace = true;
    pxRegex = handleIgnoreIdentifierRegex(identifier, unit);
  }
  const pxReplace = createPxReplace(
    pluginOptions.rootValue,
    pluginOptions.unitPrecision,
    pluginOptions.minPixelValue,
    pluginOptions.outputUnit,
    identifier
  );
  return {
    postcssPlugin: pluginName,

    Once(css: Root, { rule }) {
      css.walkDecls((decl: Declaration, index: number) => {
        // 1st check exclude
        if (
          pluginOptions.exclude &&
          css?.source?.input.file &&
          pluginOptions.exclude.exec(css?.source?.input.file) !== null
        ) {
          return;
        }
        // 2st check 'px'
        if (!decl.value.includes('px')) return;
        // 3nd check property black list
        if (blacklistedProp(decl.prop, pluginOptions.propBlackList)) return;
        // 4rd check property white list
        if (!passedWhiteListProp(decl.prop, pluginOptions.propWhiteList))
          return;
        // 5th check seletor black list
        if (decl.parent && decl.parent.type === 'rule') {
          // FIXME: typings safe decl.parent
          const selector = rule(decl.parent as any).selector;
          if (blacklistedSelector(selector, pluginOptions.selectorBlackList))
            return;
        }

        const value = decl.value.replace(pxRegex, pxReplace);

        // if rpx unit already exists, do not add or replace
        if (decl.parent && declarationExists(decl.parent, decl.prop, value))
          return;

        if (pluginOptions.replace) {
          decl.value = value;
        } else {
          decl.parent?.insertAfter(
            index,
            decl.clone({
              value,
            })
          );
        }
      });

      if (pluginOptions.mediaQuery) {
        css.walkAtRules('media', (rule: AtRule) => {
          if (!rule.params.includes('px')) return;
          rule.params = rule.params.replace(pxRegex, pxReplace);
        });
      }
    },
  };
};

postcssPluginPixel.postcss = true;

export const hpsSrvPostcssPluginPixel = postcssPluginPixel;
