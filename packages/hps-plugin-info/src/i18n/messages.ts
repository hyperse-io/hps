import type { DefineMessageType, SupportedLocales } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export type HelpPluginLocaleOverrideMessages = {
  [key in SupportedLocales]: {
    infoPlugin: {
      banner: string;
      footer: string;
    };
  };
};

export type HelpPluginLocaleMessages = {
  [K in keyof DefineMessageType<typeof infoPluginMessages>]: DefineMessageType<
    typeof infoPluginMessages
  >[K] &
    DefineMessageType<HelpPluginLocaleOverrideMessages>['infoPlugin'];
};

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages extends HelpPluginLocaleMessages {}
}

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
