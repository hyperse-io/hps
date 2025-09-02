import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const updatePluginMessages = defineLocaleMessages({
  en: {
    updatePlugin: {
      name: 'CLI Update Plugin',
      command: {
        description: 'Updating Workspace Packages',
        example: 'cli update --force <force> --project-cwd <project-cwd>',
      },
      flags: {
        projectCwd: 'The project root directory',
        force: 'Force update the dependencies',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof updatePluginMessages> {}
}
