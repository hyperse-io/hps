import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { downloadIntrospection } from './helpers/helper-download-introspection.js';
import { generateDTS } from './helpers/helper-schame.js';
import { searchGraphqlMap } from './helpers/helper-search-graphql-map.js';
import type {
  Logger,
  TypesGraphqlspConfig,
} from './types/types-graphqlsp-config.js';

export const codegenDocument = async (
  config: TypesGraphqlspConfig,
  logger: Logger
) => {
  const { outputDir, projectCwd, schemas } = config;
  try {
    let endpoints = [];
    if (schemas) {
      endpoints = schemas;
    } else {
      const graphqlMockMap = await searchGraphqlMap(config);
      if (!graphqlMockMap) {
        return;
      }
      endpoints = Object.values(graphqlMockMap).flatMap(
        (item) => item?.endpoints || []
      );
    }
    const absOutputDir = resolve(projectCwd, outputDir);
    if (!existsSync(absOutputDir)) {
      mkdirSync(absOutputDir, { recursive: true });
    }
    for (const item of endpoints) {
      const fileName = `${item.name}.d.ts`;
      const outputFile = join(absOutputDir, fileName);
      if (existsSync(outputFile)) {
        logger(
          `${fileName} already exists skip generate dts. if you want to regenerate, please delete the file.`
        );
        continue;
      }
      const result = await downloadIntrospection(item.url);
      if (!result) {
        logger(`Error downloading introspection schema for ${item.name}`);
        continue;
      }
      generateDTS(result, outputFile);
    }
  } catch (error: any) {
    logger('Error generating dts: ' + error.message);
  }
};
