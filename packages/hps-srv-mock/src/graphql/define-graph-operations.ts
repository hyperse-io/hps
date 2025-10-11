import type {
  GraphqlMockMap,
  GraphqlMockMapping,
} from '../types/types-graphql.js';

export function defineGraphqlMock<
  T extends GraphqlMockMapping = GraphqlMockMapping,
>(config: GraphqlMockMap<T>): GraphqlMockMap<T> {
  return config;
}
