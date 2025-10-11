import { writeFileSync } from 'fs';
import type { IntrospectionObjectType, IntrospectionQuery } from 'graphql';
import type { GenerateIndexService } from '../types/types-generate.js';

const getObjectType = (
  introspection: IntrospectionQuery,
  name: string | undefined
): IntrospectionObjectType | undefined => {
  if (!name) return;
  return introspection.__schema.types.find(
    (t): t is IntrospectionObjectType => t.kind === 'OBJECT' && t.name === name
  );
};

const getFieldsUnion = (
  introspection: IntrospectionQuery,
  typeName: string | undefined
): string => {
  if (!typeName) return 'undefined';
  const type = getObjectType(introspection, typeName);
  if (!type || !type.fields || type.fields.length === 0) return 'undefined';
  return type.fields.map((f) => JSON.stringify(f.name)).join(' | ');
};

export const generateDTS = (
  exportedName: string,
  introspection: IntrospectionQuery,
  outputPath: string
) => {
  const schema = introspection.__schema;
  const queryFields = getFieldsUnion(introspection, schema.queryType?.name);
  const mutationFields = getFieldsUnion(
    introspection,
    schema.mutationType?.name
  );
  const subscriptionFields = getFieldsUnion(
    introspection,
    schema.subscriptionType?.name
  );

  const output = `/* eslint-disable */
  
export type ${exportedName} = {
  types: {
    Query: ${queryFields};
    Mutation: ${mutationFields};
    Subscription: ${subscriptionFields};
  }
};
  `;
  writeFileSync(outputPath, output);
};

export const generateIndex = (
  options: GenerateIndexService[],
  outputPath: string
) => {
  const importLines: string[] = [];
  const mappingLines: string[] = [];

  options.forEach((service) => {
    service.endpoints.forEach((endpoint) => {
      importLines.push(
        `import type { ${endpoint.exportedName} } from "${endpoint.filePath}";`
      );
    });

    const endpointsContent = service.endpoints
      .map(
        (ep) =>
          `        "${ep.name}": {
          Query: ${ep.exportedName}["types"]["Query"];
          Mutation: ${ep.exportedName}["types"]["Mutation"];
          Subscription: ${ep.exportedName}["types"]["Subscription"];
        }`
      )
      .join(',\n');

    mappingLines.push(
      `    "${service.serviceName}": {\n      endpoints: {\n${endpointsContent}\n      }\n    }`
    );
  });

  const content = `/* eslint-disable */
// @ts-nocheck
import type * as HpsSrvMock from "@hyperse/hps-srv-mock";
${importLines.join('\n')}

declare module "@hyperse/hps-srv-mock" {
  interface GraphqlMockMapping {
${mappingLines.join(',\n')}
  }
}
`;

  writeFileSync(outputPath, content);
};
