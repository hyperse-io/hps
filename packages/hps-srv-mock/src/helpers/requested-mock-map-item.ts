import { logger } from '@hyperse/hps-srv-common';
import {
  type HpsMockMap,
  type HpsMockMapItem,
} from '../types/types-options.js';

/**
 * Find better matched `MockMapItem` of current `api` request
 * @param mockBaseUrl the req.baseUrl of sub-router based of top route `/api` e.g. `/api/rest` => `/rest`
 * @param mockMap the global flat mock map configuration
 */
export const requestedMockMapItem = (
  mockBaseUrl: string,
  mockMap: HpsMockMap
): HpsMockMapItem | undefined => {
  // Sort by the length of mock map `context` `DESC`
  const mockContexts = Object.keys(mockMap).sort((a, b) => b.length - a.length);
  const matchedContext = mockContexts.find((context) => {
    try {
      return new RegExp(`^${context}`).test(mockBaseUrl);
    } catch (err) {
      logger.error(`findMockMapItem -> mockContexts: "${context}", ${err}`);
      return false;
    }
  });
  return matchedContext ? mockMap[matchedContext] : undefined;
};
