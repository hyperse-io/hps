import { requireResolve } from '@hyperse/hps-srv-common';
import type { RuleSetRule, SwcLoaderOptions } from '@rspack/core';
import { shouldEnableReactFastRefresh } from '../../helpers/helper-should-enable-react-fast-refresh.js';
import { type EntryMapItem, type HpsEvolveOptions } from '../../types/index.js';

export const ruleScripts = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions
): RuleSetRule => {
  const { loaderOptions, projectCwd, inspector } = evolveOptions;
  const { modularImports = [] } = loaderOptions;
  //TODO
  // const swcModularImports = assertSwcImportOptions(projectCwd, modularImports);

  const enabledHmr = shouldEnableReactFastRefresh(
    serveMode,
    entryMapItem,
    evolveOptions
  );

  const plugins: Required<
    Required<Required<SwcLoaderOptions>['jsc']>['experimental']
  >['plugins'] = [];

  // Attach swc plugin for modular import
  plugins.push([
    requireResolve(import.meta.url, '@hyperse/hps-srv-rspack-plugin-import'),
    {
      //TODO
      modularImports: {},
    },
  ]);

  // Attach inspector swc plugin
  if (serveMode && inspector) {
    plugins.push(['@hyperse/inspector-swc-plugin', { projectCwd }]);
  }

  return {
    test: /\.(jsx|tsx|ts|js|mjs|cjs|mts|cts)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'builtin:swc-loader',
        /** @type {import('@rspack/core').SwcLoaderOptions} */
        options: {
          jsc: {
            parser: {
              decorators: true,
              syntax: 'typescript',
              tsx: true,
            },
            externalHelpers: true,
            experimental: {
              keepImportAttributes: true,
              plugins: [...plugins],
            },
            transform: {
              legacyDecorator: true,
              // config options from https://swc.rs/docs/configuration/compilation#jsctransformreact
              react: {
                runtime: 'automatic',
                pragma: 'React.createElement',
                pragmaFrag: 'React.Fragment',
                throwIfNamespace: true,
                development: enabledHmr,
                refresh: enabledHmr,
              },
            },
          },
          env: {
            // matches useBuiltIns from Babel
            mode: 'entry',
            targets: {
              browsers: ['ie >= 11', 'safari > 10'],
            },
          },
        },
      },
    ],
  };
};
