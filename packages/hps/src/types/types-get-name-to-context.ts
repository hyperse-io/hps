import type {
  WizardCommandContextLoaderResult,
  WizardWithUse,
} from '@hyperse/wizard';

export type GetNameToContext<Wizard extends WizardWithUse> =
  Wizard extends WizardWithUse<infer NameToContext, any>
    ? WizardCommandContextLoaderResult<NameToContext>
    : never;
