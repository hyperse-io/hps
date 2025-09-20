import { type DeepPartial } from '@hyperse/config-loader';
import { mergeOptions as armitMergeOptions } from '@hyperse/config-loader';

export function mergeOptions<T>(target: T, ...source: Array<DeepPartial<T>>) {
  return source.reduce((prev: T, curr: DeepPartial<T>) => {
    return armitMergeOptions(prev, curr);
  }, target);
}
