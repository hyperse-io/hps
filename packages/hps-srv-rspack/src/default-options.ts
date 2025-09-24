import { type HpsEvolveOptions } from './types/types-options.js';

export const defaultEvolveOptions: HpsEvolveOptions = {
  projectCwd: process.cwd(),
  projectVirtualPath: 'hps/evolve',
  entryMap: {},
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
    target: ['web', 'es5'],
    plugins: {
      externalPlugins: [],
      definePlugin: {
        variables: {},
      },
      tsCheckerPlugin: {
        enabled: true,
      },
      rsdoctorPlugin: {
        enabled: false,
      },
      htmlPlugin: {
        htmlCdn: '',
      },
    },
    output: {
      outputDir: 'public',
      chunkFileVirtualPath: '',
      enableBundleHashName: true,
    },
    module: {
      rules: [],
    },
    publicPath: 'auto',
    resolve: {},
    externals: {},
  },
  inspector: {
    keys: ['$mod', 'i'],
    customLaunchEditorEndpoint: '/__hps_inspector',
    trustedEditor: 'code',
    injectClient: true,
  },
};
