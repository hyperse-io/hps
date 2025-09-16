import { type MockRequest } from '../../types/types-options.js';
import { type Type, type ValidationOptions } from '../validation/validation.js';

export type ValidationMetaDataType = {
  /**
   * The `entity` class of the `validator` mapping to
   */
  entity: Type;
  /**
   * The parameter index of method.
   */
  index: number;
  /**
   * @default `body` req['body']
   */
  bodyResolver?: string | ((req: MockRequest) => Record<string, unknown>);
  /**
   * The configurations of `class-validator`
   */
  options?: Omit<ValidationOptions, 'expectedType'>;
};

export const getMetadataKey = (propertyKey: string) => {
  return `metadata_${propertyKey}`;
};
