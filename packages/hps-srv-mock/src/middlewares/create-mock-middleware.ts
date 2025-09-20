import { join } from 'node:path';
import { chalk, logger } from '@hyperse/hps-srv-common';
import { HPS_MOCK_FN_NAME } from '../constants.js';
import {
  queryActionFromDefExports,
  queryMockExports,
} from '../helpers/query-mock-exports.js';
import { requestedMockMapItem } from '../helpers/requested-mock-map-item.js';
import {
  type HpsMockMap,
  type HpsMockOptions,
  type MockNextFunction,
  type MockRequest,
  type MockRequestHandler,
  type MockResponse,
} from '../types/index.js';

export const notFound = (req: MockRequest, res: MockResponse): void => {
  res.json({
    code: 'NOT_FOUND',
    message: 'notfound',
    err: {
      flatMockFnName: req.get(HPS_MOCK_FN_NAME),
    },
  });
};

export const errorHandler = (err: Error, res: MockResponse): void => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Create mock middlewares
 * @param contextApi The context api.
 * @param mockMap The mock definition map.
 * @param mockOptions The mock options.
 */
export const createMockMiddleware = (
  contextApi: string,
  mockMap: HpsMockMap = {},
  mockOptions: HpsMockOptions = {}
): MockRequestHandler => {
  return async (
    req: MockRequest,
    res: MockResponse,
    next: MockNextFunction
  ) => {
    // Exclude `/api` from baseUrl.
    const baseUrl = req.baseUrl.replace(new RegExp(`^${contextApi}`), '');
    const matchedRequestedMockMapItem = requestedMockMapItem(baseUrl, mockMap);
    try {
      if (!matchedRequestedMockMapItem) {
        throw new Error(`No matched mock define found, baseUrl:${baseUrl} `);
      }
      // rest, func
      const flatMockFnName = req.get(HPS_MOCK_FN_NAME) as string;

      const mockExports = await queryMockExports(
        matchedRequestedMockMapItem,
        flatMockFnName,
        mockOptions
      );

      const action = queryActionFromDefExports(
        flatMockFnName,
        mockExports,
        true
      );
      if (!action) {
        return notFound(req, res);
      }
      const { name, handler } = action;
      logger.info(`Action: "${chalk(['cyan'])(join(baseUrl, name))}"`);
      void handler(req, res, next);
    } catch (err) {
      errorHandler(err as Error, res);
    }
  };
};
