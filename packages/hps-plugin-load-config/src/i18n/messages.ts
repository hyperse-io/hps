import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const loadConfigPluginMessages = defineLocaleMessages({
  en: {
    loadConfigPlugin: {
      name: 'CLI Load Config Plugin',
      command: {
        description: 'Load hps cli config file',
        example: 'cli load-config',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof loadConfigPluginMessages> {}
}
