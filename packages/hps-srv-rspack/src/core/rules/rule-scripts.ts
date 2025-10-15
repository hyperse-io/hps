import type { RuleSetRule, SwcLoaderOptions } from '@rspack/core';
import { shouldEnableReactFastRefresh } from '../../helpers/helper-should-enable-react-fast-refresh.js';
import { type EntryMapItem, type HpsEvolveOptions } from '../../types/index.js';

export const ruleScripts = (
  serveMode: boolean,
  entryMapItem: EntryMapItem,
  evolveOptions: HpsEvolveOptions
): RuleSetRule => {
  const { rspack, projectCwd, inspector } = evolveOptions;
  const { modularImports = [] } = rspack.loader;

  const enabledHmr = shouldEnableReactFastRefresh(
    serveMode,
    entryMapItem,
    evolveOptions
  );

  const plugins: Required<
    Required<Required<SwcLoaderOptions>['jsc']>['experimental']
  >['plugins'] = [];

  // Attach inspector swc plugin
  if (serveMode && inspector) {
    plugins.push(['@hyperse/inspector-swc-plugin', { projectCwd }]);
  }

  return {
    test: /\.(jsx|tsx|ts|js|mjs|cjs|mts|cts)$/,
    // Don't exclude anythings because of we need to import node_modules from `@hps`
    // exclude: /node_modules/,
    use: [
      {
        loader: 'builtin:swc-loader',
        /** @type {import('@rspack/core').SwcLoaderOptions} */
        options: {
          //support cjs and esm
          isModule: 'unknown',
          rspackExperiments: {
            import: modularImports,
          },
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
