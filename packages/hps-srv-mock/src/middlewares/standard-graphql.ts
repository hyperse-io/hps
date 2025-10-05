import { graphqlMockManager } from '../graphql/graphql-mock-manager.js';
import {
  type GraphqlMockEndpoint,
  type GraphqlMockMapItem,
  type HpsMockOptions,
  type MockNextFunction,
  type MockRequest,
  type MockRequestHandler,
  type MockResponse,
} from '../types/index.js';
import { createGraphqlEndpointMiddleware } from './standard-graphql-endpoint.js';

const searchExecutableEndpoint = async (
  serviceName: string,
  query: string,
  graphqlMockMapItem?: GraphqlMockMapItem
): Promise<GraphqlMockEndpoint | undefined> => {
  if (!graphqlMockMapItem) {
    return;
  }
  const endpointManager = await graphqlMockManager.findSupportingEndpoint(
    serviceName,
    query
  );
  if (!endpointManager) {
    return;
  }
  return endpointManager.endpoint;
};

const forGraphqlApiRequest = (
  _mockOptions: HpsMockOptions,
  serviceName: string
): MockRequestHandler => {
  const proxyMiddlewares = new Map<string, MockRequestHandler>();
  const graphqlMockManagerItem =
    graphqlMockManager.getGraphqlMockManagerItem(serviceName);
  const graphqlMockMapItem = graphqlMockManagerItem?.graphqlMockMapItem;
  const endpointManagers = graphqlMockManager.getEndpointManagers(serviceName);

  for (const endpointManager of endpointManagers) {
    proxyMiddlewares.set(
      endpointManager.endpoint.name,
      createGraphqlEndpointMiddleware(endpointManager, graphqlMockMapItem)
    );
  }

  return async (
    req: MockRequest,
    res: MockResponse,
    next: MockNextFunction
  ) => {
    if (req.path !== '/') {
      return next();
    }
    if (req.method !== 'POST' || !req.body?.query) {
      return next();
    }
    // Note: For exact mount path, there should be no loopback; additional checks unnecessary
    try {
      const { query } = req.body;
      const executableEndpoint = await searchExecutableEndpoint(
        serviceName,
        query,
        graphqlMockMapItem
      );
      const middleware = proxyMiddlewares.get(executableEndpoint?.name || '');
      if (middleware) {
        return middleware(req, res, next);
      }
      res.status(400).json({
        errors: [
          {
            message: 'Operation not supported by any available endpoint',
            extensions: {
              code: 'OPERATION_NOT_SUPPORTED',
              operationName: req.body.operationName,
              availableEndpoints: endpointManagers.map(
                (ep) => ep.endpoint.name
              ),
            },
          },
        ],
      });
      return;
    } catch (error: any) {
      res.status(500).json({
        errors: [
          {
            message: 'Internal proxy error',
            content: error.message,
          },
        ],
      });
      return;
    }
  };
};

export const standardGraphqlMiddleware = {
  forGraphqlApiRequest,
};
