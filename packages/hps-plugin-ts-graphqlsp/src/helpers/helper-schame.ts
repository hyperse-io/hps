import { writeFileSync } from 'fs';
import type { IntrospectionObjectType, IntrospectionQuery } from 'graphql';

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

  const output = `
  /* eslint-disable */
  
  export type Operations = {
    types: {
      Query: ${queryFields};
      Mutation: ${mutationFields};
      Subscription: ${subscriptionFields};
    }
  };
  `;
  writeFileSync(outputPath, output);
};
