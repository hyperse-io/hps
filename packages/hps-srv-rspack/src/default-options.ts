import { type HpsEvolveOptions } from './types/types-options.js';

export const defaultEvolveOptions: HpsEvolveOptions = {
  projectCwd: process.cwd(),
  projectVirtualPath: 'hps/evolve',
  rejectWarnings: false,
  devServer: {
    autoOpen: true,
    pageProxy: '/pages',
    clientOverlay: {
      errors: true,
      warnings: false,
      runtimeErrors: true,
    },
    webSocketURL: 'localIp',
    middlewares: [],
    watchOptions: {
      poll: 1000,
      // Use array here, easy can add a new ignore dynamic at runtime.
      ignored: ['**/node_modules', '**/mocks'],
      aggregateTimeout: 500,
    },
    defaultServeGlobalData: () => Promise.resolve({}),
    bundleDirResolver: (dir) => dir,
  },
  rspack: {
    loader: {
      assetDataUrlMaxSize: 4 * 1024,
      lessOptions: {},
      postcssOptions: {
        cssnanoOptions: {},
      },
      pixelOptions: {
        rootValue: { px: 100, rpx: 1 },
        outputUnit: 'rem',
      },
      modularImports: [],
    },
    // The default is es5
    target: ['web', 'es5'],
    plugins: {
      external: [],
      definePlugin: {
        variables: {},
      },
      tsCheckerPlugin: {
        enabled: true,
      },
      rsdoctorPlugin: {
        enabled: false,
      },
      multiHtmlPlugin: {
        htmlCdn: '',
      },
    },
    ruleSets: [],
    publicPath: 'auto',
    resolve: {},
    externals: {},
    outputDir: 'public',
    enableBundleHashName: true,
  },
  entryMap: {},
  inspector: {
    keys: ['$mod', 'i'],
    customLaunchEditorEndpoint: '/__hps_inspector',
    trustedEditor: 'code',
    injectClient: true,
  },
};
