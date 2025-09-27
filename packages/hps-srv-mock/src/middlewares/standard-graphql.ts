import { createProxyMiddleware } from 'http-proxy-middleware';
import type { ValueOf } from 'type-fest';
import { getGqlCalledFields } from '../helpers/get-gql-called-fields.js';
import { getGraphqlRootFields } from '../helpers/get-gql-root-fields.js';
import {
  type HpsMockOptions,
  type MockRequest,
  type MockRequestHandler,
} from '../types/index.js';

const forGraphqlApiRequest = (
  options: ValueOf<Required<HpsMockOptions>['graphqlMockMap']>
): MockRequestHandler => {
  return createProxyMiddleware({
    pathFilter(_, req: MockRequest) {
      if (!req.body || !req.body.query) {
        return false;
      }
      const calledFields = getGraphqlRootFields(req.body.query);
      if (!calledFields) {
        return false;
      }

      const filters = getGqlCalledFields(options, calledFields);

      if (options.strategy === 'bypass') {
        return (
          filters.findIndex((filter) => {
            return calledFields.fields.includes(filter);
          }) === -1
        );
      } else if (options.strategy === 'mock') {
        return (
          filters.findIndex((filter) => {
            return calledFields.fields.includes(filter);
          }) > -1
        );
      }
      return false;
    },
    target: options.url,
    changeOrigin: true,
    secure: false,
    cookieDomainRewrite: '',
    on: {
      proxyReq: (proxyReq, req) => {
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    },
  });
};

export const standardGraphqlMiddleware = {
  forGraphqlApiRequest,
};
