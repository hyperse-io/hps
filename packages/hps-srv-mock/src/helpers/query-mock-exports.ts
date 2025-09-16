import { relative } from 'node:path';
import { match } from 'path-to-regexp';
import { chalk, logger } from '@hyperse/hps-srv-common';
import { actionCacheManager } from '../esm-task/action-cache-manager.js';
import {
  type HpsMockMapItem,
  type HpsMockOptions,
  type MockRequestHandler,
} from '../types/types-options.js';
import { getMockCwd } from './get-mock-cwd.js';
import { loadMockMapItemDefFiles } from './load-mock-map-defs.js';
import { getMethodsOfPrototype } from './normalize-mock-exports.js';

function getRelativeFilePath(moduleId: string, mockOptions: HpsMockOptions) {
  return relative(mockOptions.projectCwd || process.cwd(), moduleId);
}

/**
 * Normalize `flatMockFnName` into match ordered pattern [`/actionName`, actionName]
 * @param actionName
 * @returns The action names could be resolve.
 */
const normalizeActionName = (actionName: string): string[] => {
  const hasSlashPrefix = /^\//.test(actionName);
  return hasSlashPrefix
    ? [actionName, actionName.replace(/\//, '')]
    : [`/${actionName}`, actionName];
};

type ExportedAction = {
  name: string;
  handler: MockRequestHandler;
};

const queryExactHandlerFromExports = (
  defExports: Record<string, MockRequestHandler>,
  testActions: string[]
) => {
  for (const action of testActions) {
    // 1. Exact action match first
    const actionHandler = defExports[action];
    // Make sure that we find `action` is function, avoid fetch `variable`
    // Consider the usage scenario as below shown: we have two mock files defined the same `action` name.
    // 1. `export const userList = []` from `mock` entry file `a.ts`.
    // 2. `export const userList = ()=> {...}` from `mock` entry file `b.ts`.
    // while we have mock request with `action` name `userList`, if we first find `userList` from `a.ts`
    // it will broken
    if (typeof actionHandler === 'function') {
      return {
        name: action,
        handler: actionHandler.bind(defExports),
      };
    }
  }
  return;
};

const queryPathRegExpHandlerFromExports = (
  defExports: Record<string, MockRequestHandler>,
  testActions: string[],
  showWarn = false
) => {
  // 2. Try using path regex to match
  const protoMethods = getMethodsOfPrototype(defExports);
  // Sorting by method length, `api/remove`, `api/remove/list`
  protoMethods.sort((a, b) => {
    return b.length - a.length;
  });

  for (const action of testActions) {
    for (const methodName of protoMethods) {
      const methodNameTestFn = match(methodName);
      const actionHandler =
        //  A match is either `false` (no match) or a match result.
        methodNameTestFn(action) !== false ? defExports[methodName] : null;

      if (typeof actionHandler === 'function') {
        if (showWarn) {
          logger.warn(`Hit path rule \`${chalk(['yellow'])(methodName)}\``);
        }
        return {
          name: action,
          handler: actionHandler.bind(defExports),
        };
      }
    }
  }
  return;
};

export const queryActionFromDefExports = (
  actionName: string,
  defExports?: Record<string, MockRequestHandler>,
  showWarn = false
): ExportedAction | undefined => {
  if (!defExports) {
    return;
  }
  const testActions = normalizeActionName(actionName);
  const actionHandler = queryExactHandlerFromExports(defExports, testActions);
  // 1. exact lookup action handler first
  if (actionHandler) {
    return actionHandler;
  }
  // 2. try using path regexp match to lookup
  return queryPathRegExpHandlerFromExports(defExports, testActions, showWarn);
};

/**
 * Try to load all mock definitions of the current mock request.
 * @param mockMapItem The local mock item configuration of mockMap
 * @param flatMockFnName The request mock `action` name. `/action` | `action`
 * @param mockOptions The mock options
 */
export const queryMockExports = async (
  mockMapItem: HpsMockMapItem,
  flatMockFnName: string,
  mockOptions: HpsMockOptions
): Promise<Record<string, MockRequestHandler> | undefined> => {
  const mockCwd = getMockCwd(mockOptions);
  const mockItemDefFiles = await loadMockMapItemDefFiles(
    mockCwd,
    mockMapItem,
    mockOptions
  );
  for (const mockFile of mockItemDefFiles) {
    const defExports = await actionCacheManager.queryActionFn(mockFile);
    const matchedDefExports = defExports.find((defExports) => {
      return !!queryActionFromDefExports(flatMockFnName, defExports);
    });
    if (matchedDefExports) {
      const relativeMockFile = getRelativeFilePath(mockFile, mockOptions);
      logger.debug(`MockFile: "${relativeMockFile}"`);
      return matchedDefExports as Record<string, MockRequestHandler>;
    }
  }
  return;
};
