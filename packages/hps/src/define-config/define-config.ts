import { defineConfig, type UserConfigExport } from '@hyperse/config-loader';
import type { WizardWithUse } from '@hyperse/wizard';
import type { EvolveConfigBase } from '../types/define-config.js';
import type { GetNameToContext } from '../types/types-get-name-to-context.js';

export function myDefineConfig<T extends WizardWithUse>(
  userConfig: UserConfigExport<GetNameToContext<T>, EvolveConfigBase>
): UserConfigExport<GetNameToContext<T>, EvolveConfigBase> {
  return defineConfig(userConfig);
}
