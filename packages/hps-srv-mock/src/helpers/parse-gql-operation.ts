import type { OperationTypeNode } from 'graphql';
import { type DocumentNode, getOperationAST, parse } from 'graphql';
import { logger } from '@hyperse/hps-srv-common';
import { getGraphqlRootFields } from './get-gql-root-fields.js';

export interface GraphqlOperationInfo {
  fields: string[];
  operationName: string | null;
  operationType: OperationTypeNode;
  document: DocumentNode;
}

export const parseOperation = (query: string): GraphqlOperationInfo | null => {
  try {
    const document = parse(query);
    const operation = getOperationAST(document, undefined);

    if (!operation) {
      return null;
    }

    const calledFields = getGraphqlRootFields(query);

    return {
      fields: calledFields?.fields || [],
      operationName: operation.name?.value || null,
      operationType: operation.operation,
      document,
    };
  } catch (error: any) {
    logger.debug('Failed to parse GraphQL operation: ' + error.message);
    return null;
  }
};
