import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const mockPluginMessages = defineLocaleMessages({
  en: {
    mockPlugin: {
      name: 'CLI Build Plugin',
      command: {
        description: 'Start a mock service',
        example: 'hps mock -n="dev.hps.com" -p="3000"',
      },
      flags: {
        hostname: 'The hostname of dev mock server.',
        port: 'The fixed mock service port.',
        mockFilters:
          'The filter `regex` will ignore some set of mock files at serve startup',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof mockPluginMessages> {}
}
