import { getIntrospectionQuery, type IntrospectionQuery } from 'graphql';

/**
 * Makes an introspection query to the GraphQL server and writes the result to a
 * schema.json file.
 *
 * @param apiPath - The GraphQL endpoint URL
 * @param outputFilePath - The file path where the schema should be saved
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function downloadIntrospection(
  apiPath: string
): Promise<IntrospectionQuery | false> {
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
    const response = await fetch(apiPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.text();
    try {
      const json = JSON.parse(data);
      return json?.data;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}
