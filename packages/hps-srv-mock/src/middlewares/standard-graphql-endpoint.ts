import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger } from '@hyperse/hps-srv-common';
import type { GraphqlEndpointManager } from '../graphql/graphql-endpoint-manager.js';
import { getGqlCalledFields } from '../helpers/get-gql-called-fields.js';
import { getGraphqlRootFields } from '../helpers/get-gql-root-fields.js';
import { type MockRequest, type MockRequestHandler } from '../types/index.js';
import type { GraphqlMockMapItem } from '../types/types-graphql.js';

export const createGraphqlEndpointMiddleware = (
  endpointManager: GraphqlEndpointManager,
  graphqlMockManagerItem?: GraphqlMockMapItem
): MockRequestHandler => {
  return createProxyMiddleware({
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
    router: (req: MockRequest) => {
      const { query } = req.body;
      const { endpoint } = endpointManager;
      const mockUrl = endpointManager.getMockConfig().serviceUrl;
      const remoteUrl = endpoint.url;
      const { enableMocking = true } = graphqlMockManagerItem || {};
      if (!enableMocking) {
        return remoteUrl;
      }
      const calledFields = getGraphqlRootFields(query);
      const filters = getGqlCalledFields(endpoint, calledFields);

      let targetUrl: string = '';
      const findIndex =
        filters.findIndex((filter) => {
          return calledFields?.fields.includes(filter);
        }) > -1;
      if (endpoint.strategy === 'bypass') {
        // 找到的应该是走 mock 的，未找到的走 remote
        targetUrl = findIndex ? mockUrl : remoteUrl;
      } else if (endpoint.strategy === 'mock') {
        // 找到的应该是走 remote 的，未找到的走 mock
        targetUrl = findIndex ? remoteUrl : mockUrl;
      }
      logger.info(`targetUrl: ${targetUrl}`);
      return targetUrl;
    },
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (_, _req, res) => {
        res.end(` Something went wrong. ${endpointManager.endpoint.name} `);
      },
    },
  });
};
