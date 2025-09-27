import type { RequiredDeep } from 'type-fest';
import type { IMocks } from '@graphql-tools/mock';
import type { IResolvers } from '@graphql-tools/utils';

export type IntrospectionLike = {
  types: {
    Query?: {
      fields: Record<string, any>;
    };
    Mutation?: {
      fields: Record<string, any>;
    };
  };
};

export type IntrospectionFieldsTuple<
  T extends IntrospectionLike,
  K extends keyof T['types'],
> = RequiredDeep<T['types']>[K] extends { fields: Record<string, any> }
  ? Array<
      keyof Extract<
        RequiredDeep<T['types']>[K],
        { fields: Record<string, any> }
      >['fields']
    >
  : string[];

export type SkipMockFields<T extends IntrospectionLike = IntrospectionLike> = {
  query?: IntrospectionFieldsTuple<T, 'Query'>;
  mutation?: IntrospectionFieldsTuple<T, 'Mutation'>;
};

export type DefinedSkipMockFields = <T extends IntrospectionLike>(config: {
  query?: IntrospectionFieldsTuple<T, 'Query'>;
  mutation?: IntrospectionFieldsTuple<T, 'Mutation'>;
}) => SkipMockFields<T>;

export type GraphqlMockMap = {
  [serviceName: string]: Pick<
    GraphqlMockMapItem,
    'url' | 'mocks' | 'apiPath' | 'skipMockFields' | 'resolvers'
  >;
};

export type GraphqlMockMapItem = {
  /**
   * The url of the GraphQL service.
   */
  url: string;
  /**
   * The mocks configuration for the GraphQL service (used for mocking data).
   */
  mocks?: IMocks<IResolvers>;
  /**
   * The resolvers for the GraphQL service.
   */
  resolvers?: IResolvers;
  /**
   * The API path of the GraphQL service (e.g., /admin-api).
   */
  apiPath?: string;
  /**
   * The fields skip list configuration for queries and mutations.
   */
  skipMockFields?: SkipMockFields;
  /**
   * The name of the GraphQL service.
   */
  serviceName?: string;
  /**
   * The file path to the introspection schema.
   */
  introspectionSchemaFilePath?: string;
  /**
   * The file path to the GraphQL schema.
   */
  graphqlSchemaFilePath?: string;
};
