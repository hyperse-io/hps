import { join } from 'node:path';
import type { Output } from '@rspack/core';
import { assertChunkFilename } from '../helpers/helper-assert-chunk-filename.js';
import { enableBundleHashName } from '../helpers/helper-enable-bundle-hashname.js';
import { getBundleFileName } from '../helpers/helper-get-bundle-file-name.js';
import { resolvePublicPath } from '../helpers/helper-resolve-public-path.js';
import type { EntryMapItem } from '../types/types-entry-map.js';
import type { HpsEvolveOptions } from '../types/types-options.js';

export const createOutput = async (
  serveMode: boolean,
  evolveOptions: HpsEvolveOptions,
  entryItem: EntryMapItem
): Promise<Output> => {
  const { projectCwd, rspack } = evolveOptions;
  const entryItemOption = entryItem[1];

  const bundleHashNameEnabled = enableBundleHashName(
    evolveOptions,
    entryItemOption?.options
  );
  // If we have customized publicPath, should be converted to `https://cdn.example.com/assets/`, `/assets/`
  const publicPath = resolvePublicPath(evolveOptions);

  // Allow us dynamic return `outputDir`, e.g dev_xxxx, we can create built directory via `branchName`
  const outputDir =
    typeof rspack.output?.outputDir === 'function'
      ? await rspack.output.outputDir()
      : rspack.output?.outputDir || 'public';

  const { uniqueName = entryItem[0], ...otherEntryOutputOptions } =
    entryItemOption.options?.output || {};

  const rspackOutput: Output = {
    // Formatting devtool sourcemap template file.
    devtoolModuleFilenameTemplate: ({ namespace, resourcePath }) => {
      return `webpack:///${join(namespace, resourcePath)}`;
    },
    // Replace output.ecmaVersion with output.environment and more detailed
    environment: {},
    // Include comments with information about the modules, Disable it can improved performance.
    pathinfo: false,
    // The output directory as an absolute path.
    path: join(projectCwd, outputDir),
    // The publicPath specifies the public URL address of the output files when referenced in a browser.
    publicPath: publicPath,
    // Specifies the name of each output file on disk. You must not specify an absolute path here!
    filename: `[name]/${getBundleFileName(
      'js',
      serveMode,
      bundleHashNameEnabled
    )}`,
    // hotUpdateMainFilename: '[runtime].[fullhash].hot-update.json',
    // The filename of non-entry chunks as relative path inside the output.path directory.
    chunkFilename: assertChunkFilename(evolveOptions, entryItem),
    // A unique name of the Rspack build to avoid multiple Rspack runtimes to conflict when using globals.
    uniqueName: serveMode ? uniqueName : undefined,
    // Extends / overrides the default output configuration
    ...otherEntryOutputOptions,
  };
  return rspackOutput;
};
