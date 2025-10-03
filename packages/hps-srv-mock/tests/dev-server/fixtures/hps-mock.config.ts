import { defineConfig, defineStrategyViolativeOperations } from '@hyperse/hps-srv-mock';
import { type Operations } from '../graphql-admin-env.js';

export default defineConfig({
  projectCwd: process.cwd(),
  hostname: 'dev.hps.com',
  mockBaseDir: `./mocks`,
  port: 40001,
  chunkSize: 3,
  staticMap: {
    '/static': 'static',
  },
  proxyMap: {
    '/proxy_mock': {
      pathRewrite: { '^/proxy_mock': '' },
      router() {
        return 'http://localhost:40001/api/vendure-dashboard-shop-api/shop-api';
      },
      headers: {
      },
      logger: console,
    },
  },
  mockMap: {
    /**
     * export-class, named class, default class.
     * 1. `/api/export-class/export-default-class`
     * 2. `/api/export-class/export-named-class`
     * 3. `/api/export-class/new-instance-export-named-class`
     */
    '/export-class': {
      type: 'REST',
      defs: ['export-class'],
      middlewares: {},
    },
    /**
     * export function,
     * 1. `/api/export-function/exportAction`
     * 2. `/api/export-function/getExportDefaultFn1`
     * 3. `/api/export-function/getExportDefaultFn2`
     */
    '/export-function': {
      type: 'REST',
      defs: ['export-function'],
      middlewares: {},
    },
    /**
     * module-exports
     * 1. `/api/module-exports/moduleExports`
     * 2. `/api/module-exports/exportsFunction`
     */
    '/module-exports': {
      type: 'REST',
      defs: ['module-exports'],
      middlewares: {},
    },
    /**
     * function-code
     * 1. `/api/function-code/moduleExports`
     * 2. `/api/function-code/exportsFunction`
     */
    '/function-code': {
      type: 'FUNC_SIMPLE',
      defs: ['function-code'],
      middlewares: {},
    },
    /**
     * others
     */
    '/*': { type: 'REST', defs: ['others'], middlewares: {} },
  },
  graphqlMockMap: {
    'hps/admin-api': {
      endpoints: [
        {
          name: 'dashboard-admin-api',
          url: 'http://localhost:4090/admin-api',
          customMocks: {},
          priority: 3,
          strategy: 'bypass',
          strategyViolativeOperations: defineStrategyViolativeOperations<Operations>({
            'query':['activeAdministrator'],
            'mutation':['addCustomersToGroup']
          }),
        },
        {
          name: 'metrics-admin-api',
          url: 'http://localhost:4060/admin-api',
          customMocks: {},
          priority: 2,
          strategy: 'bypass',
          strategyViolativeOperations: {
            'query':['hpsMetricSummary'],
            'mutation':[]
          },
        },
        {
          name: 'portal-admin-api',
          url: 'http://localhost:7001/admin-api',
          customMocks: {},
          strategy: 'mock',
          priority: 1,
          strategyViolativeOperations: {
            'query':['showcases'],
            'mutation':['login']
          },
        },
      ],
      enableMocking: true,
    },
    'hps/shop-api': {
      endpoints: [
        {
          name: 'dashboard-admin-api',
          url: 'http://localhost:4090/shop-api',
          customMocks: {},
          strategy: 'bypass',
          strategyViolativeOperations: {
            'query':['activePaymentMethods'],
            'mutation':['addCustomersToGroup']
          },
        },
      ],
      enableMocking: true,
    },
  },
});
