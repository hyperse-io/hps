import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

// define cli locale messages
export const hpsCliMessages = defineLocaleMessages({
  en: {
    hpsCli: {
      description: 'Hps CLI',
      version: '{version}',
      setCommonLogger: 'Set logger',
    },
  },
  zh: {
    hpsCli: {
      description: 'Hps CLI',
      version: '{version}',
      setCommonLogger: '设置日志记录器',
    },
  },
});

// merge cli locale messages
declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface CliLocaleMessages
    extends DefineMessageType<typeof hpsCliMessages> {
    //
  }
}
