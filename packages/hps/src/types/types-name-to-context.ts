import type {
  WizardCommandContextLoaderResult,
  WizardWithUse,
} from '@hyperse/wizard';

/**
 * Get the name to context map from a wizard
 * @param Wizard - The wizard to get the name to context map from
 * @returns The name to context map
 */
export type NameToContext<Wizard extends WizardWithUse> =
  Wizard extends WizardWithUse<infer NameToContext, any>
    ? WizardCommandContextLoaderResult<NameToContext>
    : never;
