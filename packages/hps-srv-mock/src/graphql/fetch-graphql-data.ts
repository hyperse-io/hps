import type { ValueOf } from 'type-fest';
import type { HpsMockOptions, MockRequest } from '../types/types-options.js';

const normalizeHeaders = (req: MockRequest) => {
  const forwardHeaders = [
    'host',
    'content-length',
    'connection',
    'keep-alive',
    'transfer-encoding',
    'upgrade',
    'expect',
    'proxy-authorization',
    'proxy-authenticate',
  ];
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    const lowerKey = key.toLowerCase();
    if (forwardHeaders.includes(lowerKey)) {
      continue;
    }
    headers[lowerKey] = Array.isArray(value) ? value.join(',') : String(value);
  }
  if (req.headers.cookie) {
    headers['cookie'] = String(req.headers.cookie);
  }
  return headers;
};

export const fetchGraphqlData = async (
  options: ValueOf<Required<HpsMockOptions>['graphqlMockMap']>,
  req: MockRequest
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const body = req.body;
    const headers = normalizeHeaders(req);
    fetch(options.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    })
      .then(resolve)
      .catch(reject);
  });
};
