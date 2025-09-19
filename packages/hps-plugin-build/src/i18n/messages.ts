import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const buildPluginMessages = defineLocaleMessages({
  en: {
    buildPlugin: {
      name: 'CLI Build Plugin',
      command: {
        description: 'Building hps application',
        example: 'hps build evolve',
      },
      subCommands: {
        evolve: {
          description:
            'Build hps application using @hyperse/hps-srv-rspack for web`',
          example: 'hps build evolve --compress --modules home',
          flags: {
            compress:
              'If true, it will be NODE_ENV=development, no minify, maybe has sourceMap',
            modules:
              'Filter you un wanted entry items, make we have best serve & debug performance',
          },
        },
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof buildPluginMessages> {}
}
