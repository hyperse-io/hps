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
        force: 'Force update the dependencies',
        filter:
          'Include only package names matching the given string, wildcard, glob, comma-or-space-delimited list, /regex/.',
        reject:
          'Exclude packages matching the given string, wildcard, glob, comma-or-space-delimited list, /regex/.',
        verbose: 'Log additional information for debugging.',
        deep: 'Run updates recursively in current working directory.',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof updatePluginMessages> {}
}
