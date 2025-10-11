import ts from 'typescript';
import myPlugin from '../src/index.js';
import type { TypesGraphqlspConfig } from '../src/types/types-graphqlsp-config.js';

export const createTsService = (config: TypesGraphqlspConfig) => {
  const host: ts.LanguageServiceHost = {
    getScriptFileNames: () => ['example.ts'],
    getScriptVersion: () => '1',
    getScriptSnapshot: (fileName) => {
      if (fileName === 'example.ts') {
        return ts.ScriptSnapshot.fromString("const a: number = 'x'");
      }
      return undefined;
    },
    getCurrentDirectory: () => config.projectCwd,
    getCompilationSettings: () => ({}),
    getDefaultLibFileName: ts.getDefaultLibFilePath,
    readFile: (fileName) => {
      if (fileName === 'example.ts') {
        return "const a: number = 'x'";
      }
      return undefined;
    },
    fileExists: (fileName) => {
      return fileName === 'example.ts';
    },
  };

  const languageService = ts.createLanguageService(host);

  const plugin = myPlugin({ typescript: ts });
  const wrappedLanguageService = plugin.create({
    languageService,
    languageServiceHost: host,
    serverHost: ts.sys as any,
    project: {
      projectService: {
        logger: { info: console.log } as any,
      },
    } as any,
    config: config,
  });

  return wrappedLanguageService;
};
