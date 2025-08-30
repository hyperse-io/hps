import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const infoPluginMessages = defineLocaleMessages({
  en: {
    infoPlugin: {
      name: 'CLI Info Plugin',
      command: {
        description: 'Show help information',
        example: 'cli info',
      },
    },
  },
  zh: {
    infoPlugin: {
      name: 'CLI插件',
      command: {
        description: 'CLI信息',
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
