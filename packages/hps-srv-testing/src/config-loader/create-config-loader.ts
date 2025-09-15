import { forgePluginTsPaths } from '@flatjs/forge-plugin-ts-paths';

export const createConfigLoaderOptions = async (
  tsconfig: string,
  configFile = 'flatjs-forge',
  externals: Array<RegExp | string> = ['@flatjs/forge']
) => {
  return {
    configFile,
    loaderOptions: {
      externals: externals,
      externalExclude: (moduleId: string | RegExp) => {
        return moduleId.toString().startsWith('@hyperse/');
      },
      plugins: [
        // We need to vitest source code causeof `@hyperse/config-loader`,
        // 1. push customized plugin for resolve all tsPaths
        // 2. retrive all `dependencies`,`devDependencies` of all package.json for this `mono` repo.
        forgePluginTsPaths({
          tsconfig,
        }),
      ],
    },
  };
};
