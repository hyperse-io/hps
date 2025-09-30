import { OperationTypeNode } from 'graphql';
import type { GraphqlMockEndpoint } from '../types/types-graphql.js';

export const getGqlCalledFields = (
  endpoint: GraphqlMockEndpoint,
  calledFields?: {
    type: OperationTypeNode;
    fields: string[];
  }
) => {
  if (!calledFields) {
    return [];
  }
  const { strategyViolativeOperations } = endpoint || {};
  const { query = [], mutation = [] } = strategyViolativeOperations || {};

  let filters: string[] = [];
  if (calledFields.type === OperationTypeNode.QUERY) {
    filters = query;
  } else if (calledFields.type === OperationTypeNode.MUTATION) {
    filters = mutation;
  }
  return Array.from(new Set(filters));
};
