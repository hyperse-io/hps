import { type DocumentNode, getOperationAST, parse } from 'graphql';
import { logger } from '@hyperse/hps-srv-common';

export interface GraphqlOperationInfo {
  operationName: string | null;
  operationType: 'query' | 'mutation' | 'subscription';
  document: DocumentNode;
}

export const parseOperation = (query: string): GraphqlOperationInfo | null => {
  try {
    const document = parse(query);
    const operation = getOperationAST(document, undefined);

    if (!operation) {
      return null;
    }

    return {
      operationName: operation.name?.value || null,
      operationType: operation.operation,
      document,
    };
  } catch (error: any) {
    logger.debug('Failed to parse GraphQL operation: ' + error.message);
    return null;
  }
};
