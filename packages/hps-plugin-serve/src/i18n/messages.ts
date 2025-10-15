import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const servePluginMessages = defineLocaleMessages({
  en: {
    servePlugin: {
      name: 'CLI Serve Plugin',
      command: {
        description: 'Serving hps application',
        example: 'hps serve evolve',
      },
      subCommands: {
        evolve: {
          description:
            'Serving hps application using @hyperse/hps-srv-rspack for web`',
          example: 'hps serve evolve --static-mode --modules home',
          flags: {
            staticMode: 'Start an evolve serve with static mode',
            port: 'The port corresponding to the current service',
            modules:
              'Filter you un wanted entry items, make we have best serve & debug performance',
            mockFilters:
              'The filter `regex` will ignore some set of mock files at serve startup',
          },
        },
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof servePluginMessages> {}
}
