import type {
  ConfigEnvBase,
  DeepPartial,
  LoaderOptions,
} from '@hyperse/config-loader';
import { searchConfig, type UserConfigExport } from '@hyperse/config-loader';
import type { requireResolve } from '@hyperse/hps-srv-common';

export type ConfigLoaderOptions = {
  configFile: string;
  loaderOptions: LoaderOptions;
};

export interface EvolveConfigBase extends ConfigEnvBase {
  /**
   * The current project directory.
   */
  projectCwd: string;
  /**
   * Expose `env`.`resolve` to allow dynamic resolve `esm` node modules from `hps-evolve.config.ts`
   * @example
   * ```ts
   * export default defineConfig((env) => {
   *   console.log(env.resolve(import.meta.url, 'tailwindcss'));
   *   ...
   * }
   * // Note may you need to change `module` to `ESNext` at your `tsconfig.json`
   * `tsconfig.json`
   * {
   *   "module": "ESNext"
   * }
   * ```
   */
  resolve: typeof requireResolve;
}

export const loadHpsConfigFile = async <HpsConfigOptions extends object>(
  projectCwd: string,
  configEnv: EvolveConfigBase,
  configLoaderOptions: ConfigLoaderOptions = {
    configFile: `hps`,
    loaderOptions: {
      externals: [/^@hyperse\/.*/],
    },
  }
): Promise<DeepPartial<HpsConfigOptions>> => {
  const { configFile, loaderOptions } = configLoaderOptions;
  const data = await searchConfig<
    UserConfigExport<DeepPartial<HpsConfigOptions>>
  >(configFile, projectCwd, {
    ...loaderOptions,
    projectCwd,
  });
  let localData = {};
  if (typeof data?.config === 'function') {
    localData = await data?.config(configEnv);
  } else {
    localData = data?.config || {};
  }
  return localData;
};
