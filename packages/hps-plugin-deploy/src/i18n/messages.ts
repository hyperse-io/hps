import type { DefineMessageType } from '@hyperse/wizard';
import { defineLocaleMessages } from '@hyperse/wizard';

export const deployPluginMessages = defineLocaleMessages({
  en: {
    deployPlugin: {
      name: 'CLI Deploy Plugin',
      command: {
        description: 'Deploying Static Assets',
        example:
          'cli deploy --target <target> --prefix <prefix> --project-cwd <project-cwd>',
      },
      flags: {
        projectCwd: 'The project root directory',
        target:
          'The target to deploy, multiple targets ({target}) can be specified',
        prefix: 'The prefix of the deployed file',
        match: 'The match patterns to lookup the files',
        ignore: 'The ignore patterns to exclude the files',
      },
    },
  },
  zh: {
    deployPlugin: {
      name: 'CLI部署插件',
      command: {
        description: '部署静态资源',
        example:
          'cli deploy --target <target> --prefix <prefix> --project-cwd <project-cwd>',
      },
      flags: {
        projectCwd: '项目根目录',
        target: '部署目标，可以指定多个目标({target})',
        prefix: '部署文件的前缀',
        match: '匹配文件的规则',
        ignore: '忽略文件的规则',
      },
    },
  },
});

declare module '@hyperse/wizard' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface PluginLocaleMessages
    extends DefineMessageType<typeof deployPluginMessages> {}
}
