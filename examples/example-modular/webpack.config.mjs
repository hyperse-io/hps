import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import { launchEditorEndpoint } from '@hyperse/inspector-common';
import { createLaunchEditorMiddleware } from '@hyperse/inspector-middleware';

const isDev = process.env.NODE_ENV === 'development';

const inspectorPackage = fileURLToPath(import.meta.url);
const inspectorClientEntry = resolve(
  inspectorPackage,
  '../../../packages/inspector/dist/client/index.js'
);

const config = {
  context: process.cwd(),
  mode: isDev ? 'development' : 'production',
  devServer: {
    setupMiddlewares(middlewares) {
      /**
       * @hyperse/inspector server config for webpack
       */
      middlewares.unshift(
        createLaunchEditorMiddleware({
          launchEditorEndpointBase: '/pages',
        })
      );
      return middlewares;
    },
  },
  entry: {
    main: ['./src/main.tsx', inspectorClientEntry],
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              '@babel/preset-typescript',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
            ],
            plugins: [
              [
                '@hyperse/inspector-babel-plugin',
                { projectCwd: process.cwd() },
              ],
            ],
          },
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 10 * 512 * 1024,
    maxAssetSize: 10 * 512 * 1024,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.INSPECTOR_ENDPOINT': JSON.stringify(
        `/pages${launchEditorEndpoint}`
      ),
    }),
  ],
};

export default config;
