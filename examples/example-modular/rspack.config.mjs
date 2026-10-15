import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';
import { DefinePlugin, HtmlRspackPlugin, ProgressPlugin } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev ? '/' : '/rspack/';

const config = {
  context: process.cwd(),
  mode: isDev ? 'development' : 'production',
  devServer: {
    setupMiddlewares(middlewares) {
      /**
       * @hyperse/inspector server config for rspack
       */
      middlewares.unshift(createLaunchEditorMiddleware({}));
      return middlewares;
    },
  },
  experiments: {
    css: true,
  },
  entry: {
    main: './src/main.tsx',
  },
  output: {
    publicPath,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    assetModuleFilename: 'bundle.[ext]',
    uniqueName: Math.random().toString(36).slice(2),
  },
  devtool: false,
  optimization: {
    minimize: !isDev,
    runtimeChunk: false,
    splitChunks: {
      name: false,
      chunks: 'all',
      minSize: 2500000,
      cacheGroups: {
        default: false,
        defaultVendors: false,
      },
    },
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.css', '.less'],
  },
  cache: {
    type: 'memory',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css',
      },
      {
        test: /\.tsx?$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              decorators: true,
              jsx: true,
            },
            externalHelpers: true,
            experimental: {
              keepImportAttributes: true,
              plugins: isDev
                ? [
                    [
                      '@hyperse/inspector-swc-plugin',
                      {
                        projectCwd: process.cwd(),
                      },
                    ],
                  ]
                : [],
            },
            transform: {
              decoratorMetadata: true,
              react: {
                runtime: 'automatic',
                development: isDev,
                // https://www.rspack.dev/blog/announcing-0-4#deprecating-builtinreactrefresh
                refresh: isDev,
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ProgressPlugin({}),
    new HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev && new ReactRefreshRspackPlugin(),
  ],
};

export default config;
