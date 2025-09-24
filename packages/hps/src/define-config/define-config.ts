import {
  type ConfigEnvBase,
  defineConfig,
  type UserConfigExport,
} from '@hyperse/config-loader';
import { type requireResolve } from '@hyperse/hps-srv-common';
import type { WizardWithUse } from '@hyperse/wizard';
import type { NameToContext } from '../types/types-name-to-context.js';

export interface EvolveConfigBase extends ConfigEnvBase {
  /**
   * The current project directory.
   */
  projectCwd: string;
  /**
   * Expose `env`.`resolve` to allow dynamic resolve `esm` node modules from `hps.config.ts`
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

export function myDefineConfig<T extends WizardWithUse>(
  userConfig: UserConfigExport<NameToContext<T>, EvolveConfigBase>
): UserConfigExport<NameToContext<T>, EvolveConfigBase> {
  return defineConfig(userConfig);
}
