import bodyParser from 'body-parser';
import cors from 'cors';
import express, {
  type Application,
  type RequestHandler,
  Router,
} from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { resolve } from 'node:path';
import favicon from 'serve-favicon';
import { logger } from '@hyperse/hps-srv-common';
import { faviconIcon } from '../constants.js';
import { createMockWatcher } from '../esm-task/create-mock-watcher.js';
import { getMockCwd } from '../helpers/get-mock-cwd.js';
import {
  createMockMiddleware,
  errorHandler,
  simpleFunctionCodeMiddleware,
  standardFunctionCodeMiddleware,
  standardRestApiMiddleware,
} from '../middlewares/index.js';
import {
  type HpsMockApplicationOptions,
  type HpsMockMap,
  type HpsMockMapItem,
  type HpsMockOptions,
  type HpsMockProxyMap,
  type HpsMockStaticMap,
  type MockRequestHandler,
  type MockResponse,
} from '../types/types-options.js';
import { attachGraphqlServe } from './attach-graphql-serve.js';

export const attachMockMiddlewares = async (
  app: Application,
  mockOptions: HpsMockOptions,
  applicationOptions: HpsMockApplicationOptions
) => {
  const {
    staticMap,
    proxyMap,
    mockMap,
    apiContext = '/api',
    bodyParserJson,
  } = mockOptions;

  app.use(cors());
  app.use(favicon(faviconIcon()));

  const mockCwd = getMockCwd(mockOptions);

  // Attach pre-defined express static middlewares.
  attachStaticMiddleware(app, mockCwd, staticMap);
  // Attach http proxy middleware
  attachHttpProxyMiddleware(app, proxyMap);

  // Attach body parser
  app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);
  app.use(bodyParser.json(bodyParserJson) as RequestHandler);

  // Using sub router to handler all `customized` mock.
  const apiRouter = Router({ mergeParams: true });

  // Attach graphql serve
  await attachGraphqlServe(apiRouter, mockOptions, applicationOptions);

  // Sort all mock context keys, make sure that we have below
  const mockContexts = sortMockContexts(mockMap);

  for (const context of mockContexts) {
    const mockItem = (mockMap || {})[context];

    // Setup middlewares to pre-handle request filter
    const { reqMiddlewares, resMiddlewares } =
      willUseMockItemMiddleware(mockItem);

    if (!reqMiddlewares.length) {
      logger.warn(`No request middleware apply!`);
    }

    if (!resMiddlewares.length) {
      logger.warn(`No response middleware apply!`);
    }

    // excludes standard routes.
    if (context !== '/*') {
      apiRouter.use(
        context.replace(/\*$/, ''),
        ...[
          ...reqMiddlewares,
          ...resMiddlewares,
          createMockMiddleware(apiContext, mockMap, mockOptions),
        ]
      );
    } else {
      // `/api/unkown/routes`
      logger.warn(
        `The wildcard(*) mock defs is ${JSON.stringify(mockMap?.['/*']?.defs)} `
      );
      // Handler other un matched sub route request e.g. /api/unknow_sub_routes
      // `/*` need to pass `/` into apiRouter
      apiRouter.use(
        '/',
        ...[
          ...reqMiddlewares,
          ...resMiddlewares,
          createMockMiddleware(apiContext, mockMap, mockOptions),
        ]
      );
    }
  }

  // Attach mock api configuration. default `/api`
  app.use(apiContext, apiRouter);

  // Global default error handling
  // https://expressjs.com/en/guide/error-handling.html
  // we can not keep the `next` parameter, because it will cause the `express` to treat it as a error handler middleware.
  app.use((err: unknown, _req: unknown, res: unknown, _next: unknown) => {
    errorHandler(err as unknown as Error, res as unknown as MockResponse);
  });

  // Start mock preparing task...
  return await createMockWatcher(mockOptions);
};

function builtinMockItemMiddlewares(mockItem: HpsMockMapItem) {
  // For request middleware follow standard express middleware execute orders.
  // We put it before the `builtin` request middleware immediately, we can modify real request body, headers before builtin request middlewares to run.
  const reqMiddlewares: MockRequestHandler[] = [];

  // Setup middlewares to transform response json, Note the `res` filter middleware need created use `createJsonResTransformer()`
  // Note Caused by `express-mung` the executed orders of middlewares
  // We need to put response `json` transform middleware before the other route handling middleware
  // Our `customized` middlewares will be executes after all `builtin` middlewares has been finished.
  const resMiddlewares: MockRequestHandler[] = [];

  switch (mockItem.type) {
    case 'REST':
      reqMiddlewares.push(standardRestApiMiddleware.forRestApiRequest());
      resMiddlewares.push(standardRestApiMiddleware.forRestApiResponse());
      break;
    case 'FUNC':
      reqMiddlewares.push(standardFunctionCodeMiddleware.forFuncApiRequest());
      resMiddlewares.push(
        standardFunctionCodeMiddleware.forFuncApiStandardResponse()
      );
      break;
    case 'FUNC_SIMPLE':
      reqMiddlewares.push(
        simpleFunctionCodeMiddleware.forFuncSimpleApiRequest()
      );
      resMiddlewares.push(
        simpleFunctionCodeMiddleware.forFuncSimpleApiStandardResponse()
      );
      break;
  }

  return {
    reqMiddlewares,
    resMiddlewares,
  };
}

/**
 * Setup middlewares to pre-handle request filter
 * @param mockItem
 * @param middlewaresForItem
 * @returns
 */
function willUseMockItemMiddleware(mockItem: HpsMockMapItem) {
  const middlewaresForItem = mockItem.middlewares;
  const mockItemReq = middlewaresForItem?.req || [];
  const mockItemRes = middlewaresForItem?.res || [];

  // All builtin middlewares of middleware `type`
  const { reqMiddlewares, resMiddlewares } =
    builtinMockItemMiddlewares(mockItem);

  return {
    reqMiddlewares: mockItemReq.length ? mockItemReq : reqMiddlewares,
    resMiddlewares: mockItemRes.length ? mockItemRes : resMiddlewares,
  };
}

/**
 * Sort all mock context keys, make sure that we have below
 * 1. context `/func-simple/nest`
 * 2. context `/func-simple`
 * 3. context `/rest/nest`
 * 4. context `/*`
 */
function sortMockContexts(mockMap?: HpsMockMap) {
  return Object.keys(mockMap || {})
    .filter((context) => {
      if (context !== '*' && context.startsWith('/')) {
        return true;
      } else {
        logger.warn(`Could not resolve mock context "${context}" ignore it!`);
        return false;
      }
    })
    .sort((a, b) => b.length - a.length);
}

/**
 *  Note: Attach http-proxy-middleware Move this middleware above the `bodyParser` middleware
 * Put `urlencoded(), json()` below proxy middlewares
 *
 */
function attachHttpProxyMiddleware(
  app: Application,
  proxyMap?: HpsMockProxyMap
) {
  for (const [context, proxyOption] of Object.entries(proxyMap || {})) {
    app.use(
      context,
      createProxyMiddleware({
        secure: false,
        changeOrigin: true,
        on: {
          error: (_error, _req, res) => {
            res.end(' Something went wrong. `@hyperse/hps-srv-mock proxyMap` ');
          },
        },
        ...proxyOption,
      })
    );
  }
}

/**
 * Attach pre defined express static middlewares.
 */
function attachStaticMiddleware(
  app: Application,
  mockCwd: string,
  staticMap?: HpsMockStaticMap
) {
  for (const [context, staticDir] of Object.entries(staticMap || {})) {
    const staticRoot = resolve(mockCwd, staticDir);
    app.use(context, express.static(staticRoot, { fallthrough: false }));
  }
}
