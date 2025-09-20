import ImageMinimizerPlugin, {
  type TransformerFunction,
} from 'image-minimizer-webpack-plugin';
import { projectHasYarn } from '@armit/package';
import { chalk, logger, requireResolve } from '@hyperse/hps-srv-common';

const logs = new Map<string, boolean>();

/**
 * Install libpng library & gifsicle tool
 * macos
 * =====================
 * brew install libpng
 * brew install gifsicle
 *
 * centos
 * =====================
 * sudo yum install libpng
 * sudo yum install epel-release
 * sudo yum install gifsicle
 * @returns
 */
export const imageMinimizer = () => {
  const suggestedPlugins: Array<[string, Record<string, unknown>]> = [
    // Svgo configuration here https://github.com/svg/svgo#configuration
    ['svgo', {}],
    ['gifsicle', {}],
    ['jpegtran', {}],
    ['pngquant', {}],
  ];

  const logMessage: string[] = [];
  const availabledPlugins = suggestedPlugins
    .map((item) => {
      const moduleId = item[0];
      try {
        requireResolve(import.meta.url, `imagemin-${moduleId}`);
        return item;
      } catch {
        if (!logs.get(moduleId)) {
          logs.set(moduleId, true);
          const command = chalk(['magenta'])(
            `"${
              projectHasYarn() ? 'yarn add' : 'npm install'
            } imagemin-${moduleId} -D"`
          );
          logMessage.push(`Execute ${command} for assets optimization`);
        }
        return null;
      }
    })
    .filter(Boolean);

  if (logMessage.length) {
    for (const msg of logMessage) {
      logger.warn(msg);
    }
  }

  if (availabledPlugins.length) {
    return new ImageMinimizerPlugin({
      minimizer: {
        // Recommended squoosh options for lossless optimization
        implementation:
          ImageMinimizerPlugin.imageminMinify as TransformerFunction<unknown>,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: availabledPlugins,
        },
      },
    });
  }
  return null;
};
