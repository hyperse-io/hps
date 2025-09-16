import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const buildPluginMessages = defineLocaleMessages({
  en: {
    buildPlugin: {
      name: 'CLI Build Plugin',
      command: {
        description: 'Building hps application.',
        example: 'cli build evolve',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof buildPluginMessages> {}
}
