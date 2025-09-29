import { getIntrospectionQuery } from 'graphql';
import fs, { existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { logger } from '@hyperse/hps-srv-common';

/**
 * Makes an introspection query to the GraphQL server and writes the result to a
 * schema.json file.
 *
 * @param apiPath - The GraphQL endpoint URL
 * @param outputFilePath - The file path where the schema should be saved
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function downloadIntrospectionSchema(
  apiPath: string,
  outputFilePath: string
): Promise<boolean> {
  const body = JSON.stringify({
    query: getIntrospectionQuery({
      inputValueDeprecation: true,
      descriptions: true,
      directiveIsRepeatable: true,
      schemaDescription: true,
      specifiedByUrl: true,
    }),
  });

  try {
    // Ensure output directory exists
    const outputDir = dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      logger.error(
        `HTTP error! status: ${response.status} ${response.statusText} for ${apiPath}`
      );
      return false;
    }

    const data = await response.text();
    fs.writeFileSync(outputFilePath, data, 'utf8');
    return existsSync(outputFilePath);
  } catch {
    return false;
  }
}
