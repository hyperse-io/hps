import type { IMocks } from '@graphql-tools/mock';
import type { IResolvers } from '@graphql-tools/utils';

export type IntrospectionFieldsTuple<
  T extends { types: any },
  K extends keyof T['types'],
> = T['types'][K] extends string ? Array<T['types'][K]> : never;

export type StrategyViolativeOperations<T extends { types: any }> = {
  query?: IntrospectionFieldsTuple<T, 'Query'>;
  mutation?: IntrospectionFieldsTuple<T, 'Mutation'>;
};

export type GraphqlMockEndpoint = {
  /**
   * The name of the GraphQL endpoint.
   */
  name: string;
  /**
   * The priority of the GraphQL endpoint.
   * @default 0
   */
  priority: number;
  /**
   * The url of the GraphQL endpoint.
   */
  url: string;
  /**
   * The mocks configuration for the GraphQL endpoint (used for mocking data).
   */
  customMocks?: IMocks<IResolvers>;
  /**
   * The resolvers for the GraphQL endpoint.
   */
  resolvers?: IResolvers;
  /**
   * The mock strategy for the GraphQL endpoint.
   *
   * @default 'mock'
   */
  strategy?: 'mock' | 'bypass';
  /**
   * Configure the list of query and mutation fields that require special handling (operation violations) for the GraphQL endpoint.
   *
   * - When strategy === 'bypass', the fields defined in strategyViolativeOperations will NOT be bypassed, but will always use the mock logic (i.e., these fields are always mocked).
   * - When strategy === 'mock', the fields defined in strategyViolativeOperations will NOT be mocked, but will always be bypassed to the backend (i.e., these fields always request the backend).
   */
  strategyViolativeOperations?: StrategyViolativeOperations<any>;

  /**
   * Ignore Operations for this endpoint
   */
  ignoreOperations?: StrategyViolativeOperations<any>;
};

export type GraphqlMockMap = {
  [serviceName: string]: GraphqlMockMapItem;
};

export type GraphqlMockMapItem = {
  /**
   * The endpoints of the GraphQL service.
   */
  endpoints: GraphqlMockEndpoint[];
  /**
   * Whether to enable mocking.
   * @default true
   */
  enableMocking?: boolean;
};
