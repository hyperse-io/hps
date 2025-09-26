import { OperationTypeNode } from 'graphql';
import type { ValueOf } from 'type-fest';
import { fetchGraphqlData } from '../graphql/fetch-graphql-data.js';
import { getGraphqlRootFields } from '../helpers/get-gql-root-fields.js';
import {
  type HpsMockOptions,
  type MockNextFunction,
  type MockRequest,
  type MockRequestHandler,
  type MockResponse,
} from '../types/index.js';

const forGraphqlApiRequest = (
  options: ValueOf<Required<HpsMockOptions>['graphqlMockMap']>
): MockRequestHandler => {
  const { query = [], mutation = [] } = options.skipMockFields || {};

  return async (
    req: MockRequest,
    res: MockResponse,
    next: MockNextFunction
  ) => {
    const body = req.body;
    if (!body || !body.query) {
      next();
      return;
    }

    const calledFields = getGraphqlRootFields(body.query);

    if (!calledFields) {
      next();
      return;
    }

    let filters: string[] = [];
    if (calledFields.type === OperationTypeNode.QUERY) {
      filters = query;
    } else if (calledFields.type === OperationTypeNode.MUTATION) {
      filters = mutation;
    }

    const skipMock =
      filters.findIndex((filter) => calledFields.fields.includes(filter)) > -1;

    if (skipMock) {
      const response = await fetchGraphqlData(options, req);
      const data = await response.json();
      res.status(response.status).json(data);
      return;
    }
    next();
  };
};

export const standardGraphqlMiddleware = {
  forGraphqlApiRequest,
};
