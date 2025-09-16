import { type MockBase } from '../mock/mock-base.js';

export function isConstructor(fn: Type<any> | any): boolean {
  return (
    !!fn.prototype && !!fn.prototype.constructor.name && fn.mockable === true
  );
}

const getMethods = (obj: any): string[] => {
  return Object.getOwnPropertyNames(obj).filter(function (p) {
    return typeof obj[p] === 'function';
  });
};

export const getMethodsOfPrototype = (obj: any): string[] => {
  if (obj?.constructor?.prototype) {
    return Object.getOwnPropertyNames(obj.constructor.prototype).filter(
      function (p) {
        return typeof obj[p] === 'function';
      }
    );
  }
  return [];
};
/**
 * A type representing the type rather than instance of a class.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
interface Type<T> extends Function {
  new (...args: any[]): T;
}

export const normalizeMockExports = (
  importedModule: any
): Array<Record<string, any>> => {
  const MockModule: Type<MockBase> = importedModule.default
    ? importedModule.default
    : importedModule;
  const defs = isConstructor(MockModule) ? new MockModule() : MockModule;
  // 1. Cached current defs
  const services: Record<string, any>[] = [defs];

  // 2. Try to find all function attached on defs. then put contructor instance into `services`
  getMethods(defs).forEach((name) => {
    const Method = defs[name as keyof typeof defs];
    if (Method && isConstructor(Method)) {
      services.push(new (Method as Type<MockBase>)());
    }
  });
  return services;
};
