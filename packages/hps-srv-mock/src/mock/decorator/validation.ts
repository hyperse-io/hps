import { type Type } from '../validation/validation.js';
import { getMetadataKey, type ValidationMetaDataType } from './metadata.js';

export const validation = (
  entity: Type,
  config?: Pick<ValidationMetaDataType, 'options' | 'bodyResolver'>
) => {
  return function (
    target: any,
    propertyKey: string,
    parameterIndex: number
  ): void {
    const metadataKey = getMetadataKey(propertyKey);
    const metadata: ValidationMetaDataType = {
      entity,
      options: config?.options,
      bodyResolver: config?.bodyResolver || 'body',
      index: parameterIndex,
    };
    // allow us attch multi @validation decorator on the `method`
    target[metadataKey] = [...(target[metadataKey] || []), metadata];
  };
};
