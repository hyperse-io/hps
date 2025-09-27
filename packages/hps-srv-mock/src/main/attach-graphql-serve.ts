import cors from 'cors';
import type { Router } from 'express';
import express from 'express';
import { readFileSync } from 'fs';
import type { GraphQLSchema } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { chalk, logger } from '@hyperse/hps-srv-common';
import { defaultGraphqlMocks } from '../graphql/default-mocks.js';
import { generatedSchema } from '../graphql/generated-schema.js';
import { standardGraphqlMiddleware } from '../middlewares/standard-graphql.js';
import type {
  HpsMockApplicationOptions,
  HpsMockOptions,
} from '../types/types-options.js';

const assertPath = (...paths: string[]) => {
  return paths.join('/').replace(/\/\//g, '/');
};

export const attachGraphqlServe = async (
  apiRouter: Router,
  mockOptions: HpsMockOptions,
  applicationOptions?: HpsMockApplicationOptions
) => {
  const { graphqlMockMap } = mockOptions;
  if (!graphqlMockMap) {
    return;
  }

  const schemaFiles = await generatedSchema(mockOptions);
  if (!schemaFiles) {
    return;
  }

  for (const schemaFile of schemaFiles) {
    const rootTypeDefs = readFileSync(schemaFile.graphqlSchemaFilePath, 'utf8');

    const schema: GraphQLSchema = makeExecutableSchema({
      typeDefs: [rootTypeDefs],
      resolvers: {
        ...(schemaFile.resolvers || {}),
      },
    });

    const server = new ApolloServer({
      schema: addMocksToSchema({
        schema: schema,
        mocks: {
          ...defaultGraphqlMocks,
          ...schemaFile.mocks,
        },
        preserveResolvers: true,
      }),
    });
    // Note you must call `start()` on the `ApolloServer`
    // instance before passing the instance to `expressMiddleware`
    await server.start();

    // Build router-relative path (do NOT include apiContext)

    const routerPath = assertPath(
      '/',
      schemaFile.serviceName,
      schemaFile.apiPath || '/'
    );

    apiRouter.use(
      routerPath,
      cors<cors.CorsRequest>(),
      express.json(),
      standardGraphqlMiddleware.forGraphqlApiRequest(schemaFile),
      expressMiddleware(server)
    );

    if (applicationOptions) {
      let gqlServiceUrl = assertPath(
        mockOptions.apiContext || '/api',
        schemaFile.serviceName,
        schemaFile.apiPath || '/'
      );

      gqlServiceUrl = `${applicationOptions.hostUri}${gqlServiceUrl}`;
      logger.info(
        `${schemaFile.serviceName}: ${chalk(['cyan'])(gqlServiceUrl)}`
      );
    }
  }
};
