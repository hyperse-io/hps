import _ from 'lodash';
import {
  HPS_MOCK_FN_NAME,
  HPS_MOCK_FN_TYPE,
  HPS_MOCK_META,
  hpsMockTypes,
} from '../constants.js';
import { createJsonResTransformer } from '../helpers/create-json-res-transformer.js';
import {
  type MockNextFunction,
  type MockRequest,
  type MockRequestHandler,
  type MockResponse,
} from '../types/index.js';

const forFuncSimpleApiRequest = (): MockRequestHandler => {
  return (req: MockRequest, res: MockResponse, next: MockNextFunction) => {
    const rawBody = req.body;
    const protocol = _.get(rawBody, 'protocol', rawBody);
    const realBody = _.get(rawBody, 'param', rawBody);
    const funcCode = _.get<string>(protocol, 'functionCode', 'notfound');
    const mockMeta = {
      ['FUNC_SIMPLE']: funcCode,
    };
    req.body = {
      ...realBody,
      _rawBody: rawBody,
    };
    res.set(HPS_MOCK_META, JSON.stringify(mockMeta));
    req.headers[HPS_MOCK_FN_TYPE] = hpsMockTypes.FUNC_SIMPLE;
    req.headers[HPS_MOCK_FN_NAME] = funcCode;
    next();
  };
};

const forFuncSimpleApiStandardResponse = (): MockRequestHandler => {
  return createJsonResTransformer((rawBody) => {
    return rawBody;
  });
};

export const simpleFunctionCodeMiddleware = {
  forFuncSimpleApiRequest,
  forFuncSimpleApiStandardResponse,
};
