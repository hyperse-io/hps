import { type HttpException } from '../validation/http-exception.js';
import { Validation } from '../validation/validation.js';
import { getMetadataKey, type ValidationMetaDataType } from './metadata.js';

/**
/**
 * Allow custom `alias` for `action`, Please make sure you have `@mockable()` on top class
 * @deprecated Use `alias` instead
 * @param alias The alias name of mock methods.
 */
export const mockAlias = (aliasName?: string) => {
  return alias(aliasName);
};

/**
 * Allow custom `alias` for `action`, Please make sure you have `@mockable()` on top class
 * Support path regexp `https://www.npmjs.com/package/path-to-regexp`
 * @example
 * ```ts
 * `@alias('/user/:id')`
 * `@alias('/user')`
 * `@alias('/user/:id/:name')`
 * `@alias('/user/(.*)')`
 * `@alias('/user/:id*')`
 * ```
 * @param alias The alias name of mock methods.
 */
export const alias = (aliasName?: string) => {
  return function (
    target: any,
    name: string,
    descriptor: PropertyDescriptor
  ): void {
    const methodName = aliasName || name;
    const original = descriptor.value;
    const metadataKey = getMetadataKey(name);

    // re-wraper `method` to allow `action` can access `this`
    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args;
      try {
        await validatePayload(target, metadataKey, args, req);
      } catch (err) {
        return res.status(400).json({
          code: 'payload.validation.error',
          message: (err as HttpException).errors,
          data: null,
        });
      }
      try {
        return await original.call(this, req, res, next);
      } catch (err) {
        next(err);
      }
    };
    if (methodName !== name) {
      target[methodName] = descriptor.value;
    }
  };
};

async function validatePayload(
  target: any,
  metadataKey: string,
  args: unknown[],
  req: any
) {
  const methodMetadata: ValidationMetaDataType[] = target[metadataKey] || [];
  for (const meta of methodMetadata) {
    const { index, entity, bodyResolver: body, options } = meta;
    // Make sure that this is an `req` of `express` action
    if (args[index] === req && req.app) {
      const validation = new Validation({
        ...options,
        expectedType: entity,
      });

      const bodyData =
        typeof body === 'function'
          ? body(req)
          : typeof body == 'string'
            ? req[body]
            : null;

      // Make sure the body data at least equal `{}`
      await validation.transform(bodyData || {}, {
        metatype: entity,
        type: 'body',
      });
    }
  }
}
