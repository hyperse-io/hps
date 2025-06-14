import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';
import { DefinePlugin, HtmlRspackPlugin, ProgressPlugin } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';
const publicPath = isDev ? '/' : '/rspack/';

const config = {
  context: process.cwd(),
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
    assetModuleFilename: '[name].[hash].[ext]',
    uniqueName: Math.random().toString(36).slice(2),
  },
  devtool: false,
  optimization: {
    minimize: false,
  },

  resolve: {
    extensions: ['...', '.ts', '.tsx', '.css', '.less'],
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
              plugins: [
                [
                  '@hyperse/inspector-swc-plugin',
                  {
                    projectCwd: process.cwd(),
                  },
                ],
              ],
            },
            transform: {
              decoratorMetadata: true,
              // useDefineForClassFields: true,
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
    isDev && new ReactRefreshPlugin(),
  ],
};

export default config;
