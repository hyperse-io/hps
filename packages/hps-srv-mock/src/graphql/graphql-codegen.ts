import { existsSync } from 'fs';
import { join } from 'path';
import { generate } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { logger } from '@hyperse/hps-srv-common';
import { getMockCacheDir } from '../esm-task/get-mock-cache-dir.js';
import type { GraphqlMockMapItem } from '../types/types-graphql.js';
import type { HpsMockOptions } from '../types/types-options.js';

export const graphqlCodegen = async (
  mockOptions: HpsMockOptions,
  schemaFiles: Array<GraphqlMockMapItem>
): Promise<Array<Required<GraphqlMockMapItem>>> => {
  const cacheDir = getMockCacheDir(mockOptions);
  const generates: Record<string, Types.ConfiguredOutput> = {};
  for (const schemaFile of schemaFiles) {
    if (
      !schemaFile.introspectionSchemaFilePath ||
      !existsSync(schemaFile.introspectionSchemaFilePath)
    ) {
      continue;
    }
    const graphqlSchemaFilePath = join(
      cacheDir,
      'gql-schema',
      `${schemaFile.serviceName}.graphql`
    );

    schemaFile.graphqlSchemaFilePath = graphqlSchemaFilePath;
    generates[graphqlSchemaFilePath] = {
      schema: [schemaFile.introspectionSchemaFilePath],
      plugins: ['schema-ast'],
    };
  }

  try {
    const result: Types.FileOutput[] = await generate({
      overwrite: true,
      generates,
    });
    const filePaths = result.map((result) => result.filename);
    const successSchemaFiles = schemaFiles.filter((schemaFile) => {
      if (filePaths.includes(schemaFile?.graphqlSchemaFilePath || '')) {
        return true;
      }
      logger.warn(`Not found graphql schema for ${schemaFile.serviceName}`);
      return false;
    });
    return successSchemaFiles as Array<Required<GraphqlMockMapItem>>;
  } catch (error: any) {
    logger.error(error.message);
    return [];
  }
};
