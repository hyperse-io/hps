import { OperationTypeNode } from 'graphql';
import type { ValueOf } from 'type-fest';
import type { HpsMockOptions } from '../types/types-options.js';

export const getGqlCalledFields = (
  options: ValueOf<Required<HpsMockOptions>['graphqlMockMap']>,
  calledFields: {
    type: OperationTypeNode;
    fields: string[];
  }
) => {
  const { strategyViolativeOperations } = options || {};
  const { query = [], mutation = [] } = strategyViolativeOperations || {};

  let filters: string[] = [];
  if (calledFields.type === OperationTypeNode.QUERY) {
    filters = query;
  } else if (calledFields.type === OperationTypeNode.MUTATION) {
    filters = mutation;
  }
  return Array.from(new Set(filters));
};
