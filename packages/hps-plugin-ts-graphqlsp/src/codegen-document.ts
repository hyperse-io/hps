import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import { downloadIntrospection } from './helpers/helper-download-introspection.js';
import { generateDTS } from './helpers/helper-schame.js';
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
    const absOutputDir = resolve(projectCwd, outputDir);
    if (!existsSync(absOutputDir)) {
      mkdirSync(absOutputDir, { recursive: true });
    }
    for (const item of schemas) {
      const fileName = `${item.name}.d.ts`;
      const outputFile = join(absOutputDir, fileName);
      if (existsSync(outputFile)) {
        logger(
          `${fileName} already exists skip generate dts. if you want to regenerate, please delete the file.`
        );
        continue;
      }
      const result = await downloadIntrospection(item.schema);
      if (!result) {
        logger(`Error downloading introspection schema for ${item.name}`);
        continue;
      }
      generateDTS(item, result, outputFile);
    }
  } catch (error: any) {
    logger('Error generating dts: ' + error.message);
  }
};
