import type ts from 'typescript';
import { codegenDocument } from './codegen-document.js';
import type {
  Logger,
  TypesGraphqlspConfig,
} from './types/types-graphqlsp-config.js';

function createBasicDecorator(info: ts.server.PluginCreateInfo) {
  const proxy: ts.LanguageService = Object.create(null);
  for (const k of Object.keys(info.languageService) as Array<
    keyof ts.LanguageService
  >) {
    const x = info.languageService[k]!;
    // @ts-expect-error - JS runtime trickery which is tricky to type tersely
    proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
  }

  return proxy;
}

const create = (info: ts.server.PluginCreateInfo) => {
  debugger;
  const logger: Logger = (msg: string) =>
    info.project.projectService.logger.info(`[GraphQLSP] ${msg}`);

  const config: TypesGraphqlspConfig = info.config;

  if (!config.projectCwd) {
    config.projectCwd = info.project.getCurrentDirectory();
  }

  logger(`hps-plugin-ts-graphqlsp config: ${JSON.stringify(config)}`);
  if (config.outputDir) {
    codegenDocument(config, logger);
  } else {
    logger('Not found config.outputDir, skip codegen document');
  }
  return createBasicDecorator(info);
};

const init: ts.server.PluginModuleFactory = () => {
  return { create };
};

export default init;
