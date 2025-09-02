import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const deployPluginMessages = defineLocaleMessages({
  en: {
    deployPlugin: {
      name: 'CLI Deploy Plugin',
      command: {
        description: 'Deploying Static Assets',
        example: 'cli deploy --target [target] --prefix <prefix>',
      },
      flags: {
        projectCwd: 'The project root directory',
        target:
          'The target to deploy, multiple targets ({target}) can be specified',
        prefix: 'The prefix of the deployed file',
        match: 'The match patterns to lookup the files',
        ignore: 'The ignore patterns to exclude the files',
        overrideExistFile: 'Whether to override the existing file',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof deployPluginMessages> {}
}
