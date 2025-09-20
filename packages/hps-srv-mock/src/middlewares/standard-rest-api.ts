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

const forRestApiRequest = (): MockRequestHandler => {
  return (req: MockRequest, res: MockResponse, next: MockNextFunction) => {
    const mockMeta = {
      ['REST']: req.path || '/rest_unknown_path',
    };
    res.set(HPS_MOCK_META, JSON.stringify(mockMeta));
    req.headers[HPS_MOCK_FN_TYPE] = hpsMockTypes.REST;
    req.headers[HPS_MOCK_FN_NAME] = req.path;
    next();
  };
};

const forRestApiResponse = (): MockRequestHandler => {
  return createJsonResTransformer((rawBody) => {
    return rawBody;
  });
};

export const standardRestApiMiddleware = {
  forRestApiRequest,
  forRestApiResponse,
};
