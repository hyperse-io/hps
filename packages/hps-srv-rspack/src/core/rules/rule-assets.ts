import type { RuleSetRule } from '@rspack/core';
import { resolvePublicPath } from '../../helpers/helper-resolve-public-path.js';
import { type EntryMapItem } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { FONT_PATH_REGEX, IMAGE_PATH_REGEX } from './constants.js';
import { getEntryAssetFileName, isIconSvg } from './rule-utils.js';

/**
 * Preparing image loader for normal pictures except stored in folder `icons`
 * Webpack@5 don't need `file-loader`, `raw-loader`, `url-loader` provider us `asset-modules`
 * https://webpack.js.org/guides/asset-modules/
 * @param entryMapItemList The available entries, `development` it contains multiple enties, `production`
 */
export const ruleAssets = (
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
): RuleSetRule => {
  // If we have customized publicPath, should be converted to `https://cdn.example.com/assets/`, `/assets/`
  const publicPath = resolvePublicPath(evolveOptions);

  const loader: RuleSetRule = {
    type: 'asset',
    test(resource) {
      return (
        FONT_PATH_REGEX.test(resource) ||
        (IMAGE_PATH_REGEX.test(resource) && !isIconSvg(resource))
      );
    },
    generator: {
      // Rule.generator.filename is the same as output.assetModuleFilename and works only with asset and asset/resource module types.
      filename({ filename }: { filename: string }) {
        return getEntryAssetFileName(filename, entryMapItemList, evolveOptions);
      },
      // Make sure that we use production cdn for images avoid use `requireExtensions`
      // NOTE: if `auto` we need to remove `publicPath` configuration leave it to undefined.
      publicPath: publicPath === 'auto' ? undefined : publicPath,
    },
    parser: {
      // Now webpack will automatically choose between resource and inline by following
      // a default condition: a file with size less than 8kb will be treated as a inline module type and resource module type otherwise.
      dataUrlCondition: {
        maxSize: evolveOptions.rspack.loader.assetDataUrlMaxSize, // 4 * 1024, // 4kb
      },
    },
  };
  return loader;
};
