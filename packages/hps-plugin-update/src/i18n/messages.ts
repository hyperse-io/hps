import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const updatePluginMessages = defineLocaleMessages({
  en: {
    updatePlugin: {
      name: 'CLI Update Plugin',
      command: {
        description: 'Updating Workspace Packages',
        example:
          'cli update --target <target> --prefix <prefix> --project-cwd <project-cwd>',
      },
      flags: {
        projectCwd: 'The project root directory',
        force: 'Force update the dependencies',
      },
    },
  },
  zh: {
    updatePlugin: {
      name: 'CLI更新插件',
      command: {
        description: '更新工作区包',
        example:
          'cli update --target <target> --prefix <prefix> --project-cwd <project-cwd>',
      },
      flags: {
        projectCwd: '项目根目录',
        force: '强制更新依赖',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof updatePluginMessages> {}
}
