import { jsonMiddleware } from 'express-response-middleware';
import {
  type MockRequest,
  type MockRequestHandler,
  type MockResponse,
} from '../types/index.js';

export type MockResJsonTransfrom = (
  body: any,
  request: MockRequest,
  response: MockResponse
) => Record<string, unknown>;
/**
 * The helper tool for create `RequestHandler` to wrap latest json data of `res.json`
 * @param transformFn
 */
export const createJsonResTransformer = (
  transformFn: MockResJsonTransfrom
): MockRequestHandler => {
  return jsonMiddleware((rawBody, req, res) => {
    // Keep the previous `express-mung` behaviour: skip error responses
    if (res.statusCode >= 400) return rawBody;
    return transformFn(rawBody, req, res);
  });
};
