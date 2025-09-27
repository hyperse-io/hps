import { existsSync } from 'fs';
import { join } from 'path';
import { rmrfSync } from '@armit/file-utility';
import { getMockCacheDir } from '../esm-task/get-mock-cache-dir.js';
import type { GraphqlMockMapItem } from '../types/types-graphql.js';
import type { HpsMockOptions } from '../types/types-options.js';
import { downloadIntrospectionSchema } from './download-introspection-schema.js';
import { graphqlCodegen } from './graphql-codegen.js';

export const generatedSchema = async (
  mockOptions: HpsMockOptions
): Promise<Array<Required<GraphqlMockMapItem>>> => {
  const { graphqlMockMap } = mockOptions;
  if (!graphqlMockMap) {
    return [];
  }
  const cacheDir = getMockCacheDir(mockOptions);
  const gqlSchemaDir = join(cacheDir, 'gql-schema');

  if (existsSync(gqlSchemaDir)) {
    // ensure the gql schema dir is empty
    rmrfSync(gqlSchemaDir);
  }

  const schemaFiles: Array<GraphqlMockMapItem> = [];
  for (const [serviceName, item] of Object.entries(graphqlMockMap)) {
    const introspectionSchemaFilePath = join(
      gqlSchemaDir,
      `${serviceName}.json`
    );
    const downloadSuccess = await downloadIntrospectionSchema(
      item.url,
      introspectionSchemaFilePath
    );
    if (!downloadSuccess) {
      continue;
    }
    schemaFiles.push({
      ...item,
      serviceName,
      introspectionSchemaFilePath,
    });
  }

  if (schemaFiles.length === 0) {
    return [];
  }

  const result = await graphqlCodegen(mockOptions, schemaFiles);
  return result;
};
