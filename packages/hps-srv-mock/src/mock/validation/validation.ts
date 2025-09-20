import classTransformer, { type TransformOptions } from 'class-transformer';
import classValidator, {
  type ValidationError,
  type ValidatorOptions,
} from 'class-validator';
import { iterate } from 'iterare';
import _ from 'lodash';
import { types } from 'node:util';
import { HttpException } from './http-exception.js';

export type Paramtype = 'body' | 'custom';

/**
 * Interface describing a pipe implementation's `transform()` method metadata argument.
 *
 * @publicApi
 */
export interface ArgumentMetadata {
  /**
   * Indicates whether argument is a body, or custom parameter
   */
  readonly type: Paramtype;
  /**
   * Underlying base type (e.g., `String`) of the parameter, based on the type
   * definition in the route handler.
   */
  readonly metatype: Type;
}

export interface ValidationOptions extends ValidatorOptions {
  disableErrorMessages?: boolean;
  expectedType: Type;
  transformOptions?: TransformOptions;
  validateCustomDecorators?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export class Validation {
  protected isDetailedOutputDisabled?: boolean;
  protected validatorOptions: ValidatorOptions = {};
  protected transformOptions: TransformOptions = {};
  protected validateCustomDecorators: boolean;
  protected exceptionFactory: (errors: ValidationError[]) => unknown =
    this.createExceptionFactory();
  protected expectedType: Type;
  constructor(options: ValidationOptions) {
    const {
      disableErrorMessages,
      transformOptions,
      expectedType,
      validateCustomDecorators,
      ...validatorOptions
    } = options || {};
    this.validatorOptions = { forbidUnknownValues: false, ...validatorOptions };
    this.transformOptions = transformOptions || {};
    this.isDetailedOutputDisabled = disableErrorMessages;
    this.validateCustomDecorators = validateCustomDecorators || false;
    this.expectedType = expectedType;
  }

  public async transform(value: any, metadata: ArgumentMetadata) {
    metadata = { ...metadata, metatype: this.expectedType };

    const metatype = metadata.metatype;

    const isPrimitive = this.isPrimitive(value);
    this.stripProtoKeys(value);

    let entity = classTransformer.plainToInstance(
      metatype,
      value,
      this.transformOptions
    );

    const originalEntity = entity;
    const isCtorNotEqual = entity.constructor !== metatype;

    if (isCtorNotEqual && !isPrimitive) {
      entity.constructor = metatype;
    } else if (isCtorNotEqual) {
      // when "entity" is a primitive value, we have to temporarily
      // replace the entity to perform the validation against the original
      // metatype defined inside the handler

      entity = { constructor: metatype } as any;
    }

    const errors = await this.validate(entity, this.validatorOptions);
    if (errors.length > 0) {
      throw await this.exceptionFactory(errors);
    }

    if (isPrimitive) {
      // if the value is a primitive value and the validation process has been successfully completed
      // we have to revert the original value passed through the pipe
      entity = originalEntity;
    }

    return entity;
  }

  protected validate(
    object: object,
    validatorOptions?: ValidatorOptions
  ): Promise<ValidationError[]> | ValidationError[] {
    return classValidator.validate(object, validatorOptions);
  }

  protected createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      if (this.isDetailedOutputDisabled) {
        return new HttpException();
      }
      const errors = this.flattenValidationErrors(validationErrors);
      return new HttpException(errors);
    };
  }

  protected toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype, type } = metadata;
    if (type === 'custom' && !this.validateCustomDecorators) {
      return false;
    }
    const types = [String, Boolean, Number, Array, Object, Buffer];
    return !types.some((t) => metatype === t) && !_.isNil(metatype);
  }

  protected stripProtoKeys(value: any) {
    if (
      value == null ||
      typeof value !== 'object' ||
      types.isTypedArray(value)
    ) {
      return;
    }
    if (Array.isArray(value)) {
      for (const v of value) {
        this.stripProtoKeys(v);
      }
      return;
    }
    delete value.__proto__;
    for (const key in value) {
      this.stripProtoKeys(value[key]);
    }
  }

  protected isPrimitive(value: unknown): boolean {
    return ['number', 'boolean', 'string'].includes(typeof value);
  }

  protected flattenValidationErrors(
    validationErrors: ValidationError[]
  ): string[] {
    return iterate(validationErrors)
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flatten()
      .filter((item) => !!item.constraints)
      .map((item) => Object.values(item.constraints || {}))
      .flatten()
      .toArray();
  }

  protected mapChildrenToValidationErrors(
    error: ValidationError,
    parentPath?: string
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors: ValidationError[] = [];
    parentPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(
          ...this.mapChildrenToValidationErrors(item, parentPath)
        );
      }
      validationErrors.push(
        this.prependConstraintsWithParentProp(parentPath, item)
      );
    }
    return validationErrors;
  }

  protected prependConstraintsWithParentProp(
    parentPath: string,
    error: ValidationError
  ): ValidationError {
    const constraints: Record<string, string> = {};
    for (const key in error.constraints) {
      constraints[key] = `${parentPath}.${error.constraints[key]}`;
    }
    return {
      ...error,
      constraints,
    };
  }
}
