import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { logger } from '@hyperse/hps-srv-common';
import { downloadIntrospection } from './helpers/helper-download-introspection.js';
import { generateDTS } from './helpers/helper-schame.js';
import { searchGraphqlMap } from './helpers/helper-search-graphql-map.js';
import type { TypesGraphqlspConfig } from './types/types-graphqlsp-config.js';

export const codegenDocument = async (config: TypesGraphqlspConfig) => {
  const { outputDir, projectCwd = process.cwd() } = config;
  try {
    const graphqlMockMap = await searchGraphqlMap(config);

    if (!graphqlMockMap) {
      return;
    }
    const endpoints = Object.values(graphqlMockMap).flatMap(
      (item) => item?.endpoints || []
    );
    const rootDir = resolve(projectCwd, outputDir);
    if (!existsSync(rootDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    for (const item of endpoints) {
      const fileName = `${item.name}.d.ts`;
      const outputFile = join(rootDir, fileName);
      if (existsSync(outputFile)) {
        logger.warn(
          `${fileName} already exists skip generate dts. if you want to regenerate, please delete the file.`
        );
        continue;
      }
      const result = await downloadIntrospection(item.url);
      if (!result) {
        logger.warn(`Error downloading introspection schema for ${item.name}`);
        continue;
      }
      generateDTS(result, outputFile);
    }
  } catch (error: any) {
    logger.warn('Error generating dts: ' + error.message);
  }
};
