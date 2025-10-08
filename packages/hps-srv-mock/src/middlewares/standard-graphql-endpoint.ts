import { createProxyMiddleware } from 'http-proxy-middleware';
import { chalk, logger } from '@hyperse/hps-srv-common';
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
        // The fields found should be mocked, and the fields not found should be bypassed to the remote
        targetUrl = findIndex ? mockUrl : remoteUrl;
      } else if (endpoint.strategy === 'mock') {
        // The fields found should be bypassed to the remote, and the fields not found should be mocked
        targetUrl = findIndex ? remoteUrl : mockUrl;
      }

      const log = ['[ '];
      log.push(chalk(['cyan'])(`${endpoint.name} (${endpoint.strategy})`));
      log.push(' ] ');
      if (calledFields?.fields) {
        log.push('[ ');
        log.push(chalk(['magenta'])(calledFields.fields.join(', ')));
        log.push(' ] ');
      }
      log.push(chalk(['cyan'])('-> '));
      log.push(targetUrl);
      logger.info(log.join(''));
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
