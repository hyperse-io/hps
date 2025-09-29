import type { Router } from 'express';
import type { GraphQLSchema } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { chalk } from '../../../hps-srv-common/src/index.js';
import { defaultGraphqlMocks } from '../graphql/default-mocks.js';
import type { GraphqlEndpointManager } from '../graphql/graphql-endpoint-manager.js';
import { graphqlMockManager } from '../graphql/graphql-mock-manager.js';
import { assertPath } from '../helpers/assert-path.js';
import { printGqlServices } from '../helpers/print-gql-services.js';
import { standardGraphqlMiddleware } from '../middlewares/standard-graphql.js';
import type {
  HpsMockApplicationOptions,
  HpsMockOptions,
} from '../types/types-options.js';

export const startApolloServer = async (
  endpointManager: GraphqlEndpointManager
): Promise<ApolloServer | undefined> => {
  const { endpoint } = endpointManager;
  const rootTypeDefs = await endpointManager.getAstSchema();
  if (!rootTypeDefs) {
    return;
  }
  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: [rootTypeDefs],
    resolvers: {
      ...(endpoint.resolvers || {}),
    },
  });

  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: schema,
      mocks: {
        ...defaultGraphqlMocks,
        ...(endpoint.customMocks || {}),
      },
      preserveResolvers: true,
    }),
  });

  await server.start();
  return server;
};

export const attachGraphqlMockItem = async (
  apiRouter: Router,
  mockOptions: HpsMockOptions,
  serviceName: string
) => {
  const graphqlMiddleware = standardGraphqlMiddleware.forGraphqlApiRequest(
    mockOptions,
    serviceName
  );
  const routerPath = assertPath('/', serviceName);
  apiRouter.use(routerPath, graphqlMiddleware);

  const endpointManagers = graphqlMockManager.getEndpointManagers(serviceName);
  const printData = [];
  for (const endpointManager of endpointManagers) {
    const server = await startApolloServer(endpointManager);
    if (!server) {
      continue;
    }
    const { proxyPath, serviceUrl } = endpointManager.getMockConfig();
    apiRouter.use(proxyPath, expressMiddleware(server));
    printData.push(
      `${endpointManager.endpoint.name}  ${chalk(['blue'])(serviceUrl)}`
    );
  }
  printGqlServices(`GraphQL mock services for ${serviceName}`, printData);
};

export const attachGraphqlServe = async (
  apiRouter: Router,
  mockOptions: HpsMockOptions,
  applicationOptions: HpsMockApplicationOptions
) => {
  const { graphqlMockMap } = mockOptions;
  if (!graphqlMockMap) {
    return;
  }

  await graphqlMockManager.setup(mockOptions, applicationOptions);

  for (const serviceName of Object.keys(graphqlMockMap)) {
    await attachGraphqlMockItem(apiRouter, mockOptions, serviceName);
  }
};
