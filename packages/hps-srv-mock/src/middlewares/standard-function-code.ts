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

const forFuncApiRequest = (): MockRequestHandler => {
  return (req: MockRequest, res: MockResponse, next: MockNextFunction) => {
    const rawBody = req.body;
    const protocol = _.get(rawBody, 'request.body.protocol', rawBody);
    const realBody = _.get(rawBody, 'request.body.param', rawBody);
    const funcCode = _.get<string>(protocol, 'functionCode', 'notfound');
    const mockMeta = {
      ['FUNC']: funcCode,
    };
    req.body = {
      ...realBody,
      _rawBody: rawBody,
    };
    res.set(HPS_MOCK_META, JSON.stringify(mockMeta));
    req.headers[HPS_MOCK_FN_TYPE] = hpsMockTypes.FUNC;
    req.headers[HPS_MOCK_FN_NAME] = funcCode;
    next();
  };
};

const forFuncApiStandardResponse = (): MockRequestHandler => {
  return createJsonResTransformer((rawBody) => {
    const overrideResponse = { response: _.get(rawBody, 'response', {}) };
    const body = _.get(rawBody, 'response.body', rawBody);
    const respHeader = {
      response: {
        header: {
          rspDesc: '成功',
          rspTime: Date.now(),
          rspType: '0',
          rspCode: '0000',
        },
      },
    };
    return _.merge(respHeader, overrideResponse, { response: { body } });
  });
};

export const standardFunctionCodeMiddleware = {
  forFuncApiRequest,
  forFuncApiStandardResponse,
};
