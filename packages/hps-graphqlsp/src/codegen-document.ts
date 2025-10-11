import { existsSync, mkdirSync } from 'fs';
import { basename, join, resolve } from 'path';
import { downloadIntrospection } from './helpers/helper-download-introspection.js';
import { generateDTS, generateIndex } from './helpers/helper-schame.js';
import { toPascalCase } from './helpers/helper-to-pascal-case.js';
import type { GenerateIndexService } from './types/types-generate.js';
import type {
  Logger,
  TypesGraphqlspConfig,
} from './types/types-graphqlsp-config.js';

export const codegenDocument = async (
  config: TypesGraphqlspConfig,
  logger: Logger
) => {
  const { outputDir, projectCwd, graphql } = config;
  try {
    if (!graphql) {
      return;
    }
    const absOutputDir = resolve(projectCwd, outputDir);
    if (!existsSync(absOutputDir)) {
      mkdirSync(absOutputDir, { recursive: true });
    }

    const serviceResult: GenerateIndexService[] = [];

    for (const [serviceName, serviceConfig] of Object.entries(graphql)) {
      const result: GenerateIndexService = {
        serviceName,
        endpoints: [],
      };
      const schemas = serviceConfig.schemas || [];
      for (const item of schemas) {
        const fileName = `${item.name}.d.ts`;
        const outputFile = join(absOutputDir, fileName);
        if (existsSync(outputFile)) {
          logger(
            `${fileName} already exists skip generate dts. if you want to regenerate, please delete the file.`
          );
          continue;
        }
        const introspectionFile = await downloadIntrospection(item.schema);
        if (!introspectionFile) {
          logger(`Error downloading introspection schema for ${item.name}`);
          continue;
        }
        // export function name
        const exportedName = toPascalCase(`${item.name} operations`);
        generateDTS(exportedName, introspectionFile, outputFile);
        const fileBasename = basename(outputFile, '.d.ts');
        result.endpoints.push({
          name: item.name,
          exportedName,
          filePath: `./${fileBasename}.js`,
        });
      }
      serviceResult.push(result);
    }

    // generate index.ts
    if (serviceResult.length > 0) {
      const indexOutputFile = join(absOutputDir, 'index.ts');
      generateIndex(serviceResult, indexOutputFile);
    }
  } catch (error: any) {
    logger('Error generating dts: ' + error.message);
  }
};
