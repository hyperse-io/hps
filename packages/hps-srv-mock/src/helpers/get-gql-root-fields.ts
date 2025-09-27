import type { OperationTypeNode } from 'graphql';
import { parse } from 'graphql';

export function getGraphqlRootFields(query: string):
  | {
      type: OperationTypeNode;
      fields: string[];
    }
  | undefined {
  try {
    const ast = parse(query);
    const root = ast.definitions.find(
      (def) => def.kind === 'OperationDefinition'
    );

    if (!root || root.kind !== 'OperationDefinition') return;

    const rootFields = root.selectionSet.selections
      .filter((sel) => sel.kind === 'Field')
      .map((field) => field.name.value);

    return {
      type: root.operation,
      fields: rootFields,
    };
  } catch {
    return;
  }
}
