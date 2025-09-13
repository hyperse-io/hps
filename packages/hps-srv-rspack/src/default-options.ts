import { type HpsEvolveOptions } from './types/types-options.js';

export const defaultEvolveOptions: HpsEvolveOptions = {
  projectCwd: process.cwd(),
  projectVirtualPath: 'flatjs/evolve',
  rejectWarnings: false,
  devServer: {
    autoOpen: true,
    pageProxy: '/pages',
    mockOptions: {
      mockBaseDir: 'mocks',
    },
    clientOverlay: {
      errors: true,
      warnings: false,
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
    // The default is es5
    target: ['web', 'es5'],
    plugins: [],
    ruleSets: [],
    publicPath: 'auto',
    resolve: {},
    externals: {},
    outputDir: 'public',
    enableBundleHashName: true,
  },
  pluginOptions: {},
  loaderOptions: {
    assetDataUrlMaxSize: 4 * 1024,
    babelOptions: {
      // 默认值的必须使用object类型, 如果使用函数, 会导致merge默认值失败.
      usePreset: 'react',
      plugins: [],
      presets: [],
    },
    lessOptions: {},
    postcssOptions: {
      cssnanoOptions: {},
    },
    pixelOptions: {
      rootValue: { px: 100, rpx: 1 },
      outputUnit: 'rem',
    },
    // Always defined in evolve.config.js
    modularImports: [],
  },
  entryMap: {},
  // The configurations for plugin `@flatjs/evolve`, `multi-cdn-plugin`
  multiHtmlCdn: {},
  // Do not use arrow function here.
  multiHtmlCdnEnvResolver: function cdnResolver() {
    return undefined;
  },
  needVerifyPackages: {},
  packageInstallChecker: {
    enabled: false,
    detectModules: ['@dimjs/*'],
    throwError: false,
    showAllInstalledGraph: true,
  },
  isolation: false,
  maxEntryGroupSize: 100,
  openRsdoctor: false,
  inspector: {
    keys: ['$mod', 'i'],
    customLaunchEditorEndpoint: '/__hps_inspector',
    trustedEditor: 'code',
    injectClient: true,
  },
};
