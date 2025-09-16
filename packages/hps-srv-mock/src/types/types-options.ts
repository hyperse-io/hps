import type { OptionsJson } from 'body-parser';
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express';
import { type Options } from 'http-proxy-middleware';
import { type hpsMockTypes } from '../constants.js';

export type MockRequest = Request;
export type MockResponse = Response;
export type MockRequestHandler = RequestHandler;
export type MockNextFunction = NextFunction;

/**
 * The middleware configuration of express.static
 * @example
 * { '/static': '/mocks/statics'}
 */
export interface HpsMockStaticMap {
  [context: string]: string;
}

export interface HpsMockProxyMap {
  [context: string]: HpsMockProxyConfig;
}

/**
 * The `http-proxy-middleware` as below link
 * @link https://github.com/chimurai/http-proxy-middleware
 */
export type HpsMockProxyConfig = Options;

/**
 * All flat mock types.
 */
export type HpsMockTypes = keyof typeof hpsMockTypes;

/**
 * The customized middlewares for each mock item.
 */
export type MockItemMiddlewares = {
  req?: MockRequestHandler[];
  res?: MockRequestHandler[];
};

/**
 * The local mock item configuration of `mockMap`
 */
export interface HpsMockMapItem {
  /**
   * The defs folder lookup deep
   * @example { defs: ['folder'] }, default walk through `folder/module.ts(deep:1)`, ignore `folder/child/module.ts(deep:2)`
   * @default 1
   */
  defsDeep?: number;
  /**
   * Values in `"FUNC" | "FUNC_SIMPLE" | "REST" | "OTHER"`
   */
  type: HpsMockTypes;
  /**
   * The folder name relative to `mockBaseDir`, also support nested directory
   * @example [`folder`,`folder/abc`]
   */
  defs: string[];
  /**
   * The `req/res` middlewares of the mockMapItem.
   */
  middlewares?: MockItemMiddlewares;
}

/**
 * The mock map configuration
 * contxt support `/a/b`、`/a`、`/*`
 * @example `'/product/detail': { defs: [string, ...string[]]; middlewares:[] }`
 */
export type HpsMockMap = Record<string, HpsMockMapItem> & {
  /**
   * The wildcard "/*" support, fallback all nofound request into this.
   */
  ['/*']?: HpsMockMapItem;
};

export type SecureContextHttps = {
  /**
   * The privateKey
   */
  key: string;
  /**
   * The certificate
   */
  cert: string;
};

export interface HpsMockOptions {
  /**
   * Push into a chunk every 50 files.
   * @default 100
   */
  chunkSize?: number;

  /**
   * Allow customized options for bodyParser.json, e.g size limit
   * @default { limit: '100kb' }
   */
  bodyParserJson?: OptionsJson;

  /**
   * The node modules which will be imported from `mocks`
   * @default ['@hyperse/mock','@hyperse/common', 'mockjs', 'lodash', 'class-validator', 'class-transformer',]
   */
  //TODO
  externals?: Array<RegExp | string>;
  /**
   * Project root
   * @default process.cwd()
   */
  projectCwd?: string;
  /**
   * The base directory of mock, it should be an relative path to projectCwd.
   * @default `./mocks`
   */
  mockBaseDir?: string;

  /**
   * A preferred port or an iterable of preferred ports to use
   * @default 4001
   */
  port?: number;
  /**
   * https://github.com/FiloSottile/mkcert
   * privateKey `example.com+3-key.pem`
   * certificate `example.com+3.pem`
   * @example
   * ```ts
   * // 引入秘钥
   * export const privateKey = fs.readFileSync(
   *   path.resolve(__dirname, '../certificate/127.0.0.1+6-key.pem'),
   *   'utf8',
   * );
   * // 引入公钥
   * export const certificate = fs.readFileSync(path.resolve(__dirname, '../certificate/127.0.0.1+6.pem'), 'utf8');
   *
   * ```
   */
  https?: SecureContextHttps;
  /**
   * The hostname of mock service `dev.hps.com`
   * @default `dev.hps.com`
   */
  hostname?: string;
  /**
   * express.static configuration
   */
  staticMap?: HpsMockStaticMap;
  /**
   * The mock api context.
   * @default `/api`
   */
  apiContext?: string;
  /**
   * `http-proxy-middleware`
   * @example
   * ```ts
   *  {
   *  '/ME_PROXY': {
   *    logger: console,
   *    pathRewrite: { '^/ME_PROXY': '' },
   *    router() {
   *      return `https://domain.com`;
   *    },
   *    headers: {
   *      origin: 'https://domain.com',
   *    },
   *  },
   * ```
   */
  proxyMap?: HpsMockProxyMap;
  /**
   * The mock configurations `mockApiContext`
   * @example
   * `'/product/detail': { defs: [string, ...string[]]; middlewares:[] }`
   * `'/product': { defs: [string, ...string[]]; middlewares:[] }`
   * `'*': { defs: [string, ...string[]]; middlewares:[] }`
   */
  mockMap?: HpsMockMap;
  /**
   * The filter `regex` will ignore some set of mock files globally at serve startup
   * @default undefined
   */
  mockFilters?: Array<string | RegExp>;
}
