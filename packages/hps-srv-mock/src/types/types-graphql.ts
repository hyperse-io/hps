import type { IMocks } from '@graphql-tools/mock';
import type { IResolvers } from '@graphql-tools/utils';

export type GraphqlMockEndpoint<
  Q extends string = string,
  M extends string = string,
  AllEndpoints extends Record<string, any> = Record<string, any>,
> = {
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
  strategyViolativeOperations?: {
    query?: Q[];
    mutation?: M[];
  };
  /**
   * Redirect specified query/mutation fields to another endpoint within the same service.
   *
   * Behavior:
   * - If a request contains any field listed in a rule, the entire request will be forwarded to the rule's targetEndpoint.
   * - targetEndpoint must be different from the current endpoint and must exist within the same service.
   * - If multiple rules match, the first matching rule in the array takes precedence; if a field appears in multiple rules, the earliest rule wins.
   * - If a field is also listed in strategyViolativeOperations, strategyViolativeOperations takes precedence.
   * - If no rule matches, the request is handled according to the current endpoint's strategy.
   *
   * Use cases: field-based routing, traffic splitting, or separation of responsibilities.
   *
   * Example:
   * ```ts
   * redirectOperations: [
   *   {
   *     operations: { query: ['getUser', 'listUsers'], mutation: ['createUser'] },
   *     targetEndpoint: 'user-management-endpoint',
   *   }
   * ]
   * ```
   */
  redirectOperations?: {
    operations: {
      query?: Q[];
      mutation?: M[];
    };
    targetEndpoint: keyof AllEndpoints;
  }[];
};

/**
 * The mapping interface for GraphQL services, endpoints, and their operations.
 *
 * Structure:
 * - Top-level keys represent service names.
 * - Each service contains an `endpoints` object.
 * - Each endpoint lists its available `Query` and `Mutation` operations as string literal types.
 */
export interface GraphqlMockMapping {
  [name: string]: any;
}

export type GraphqlMockMapItem<
  T extends GraphqlMockMapping = GraphqlMockMapping,
  ServiceName extends keyof T = keyof T,
> = {
  endpoints: {
    [EndpointName in keyof T[ServiceName]['endpoints']]?: GraphqlMockEndpoint<
      T[ServiceName]['endpoints'][EndpointName]['Query'],
      T[ServiceName]['endpoints'][EndpointName]['Mutation'],
      T[ServiceName]['endpoints']
    >;
  };
  enableMocking?: boolean;
};

export type GraphqlMockMap<T extends GraphqlMockMapping = GraphqlMockMapping> =
  {
    [ServiceName in keyof T]?: GraphqlMockMapItem<T, ServiceName>;
  };
