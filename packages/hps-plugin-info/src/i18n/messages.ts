import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const infoPluginMessages = defineLocaleMessages({
  en: {
    infoPlugin: {
      name: 'CLI Info Plugin',
      command: {
        description: 'Show hyperse cli system information',
        example: 'cli info',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof infoPluginMessages> {}
}
