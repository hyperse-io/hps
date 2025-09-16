import mung from 'express-mung';
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
  const transfer: MockResJsonTransfrom = (rawBody, req, res) => {
    return transformFn(rawBody, req, res);
  };
  return mung.json(transfer);
};
