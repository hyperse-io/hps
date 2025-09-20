import { arrayPad } from './array-pad.js';

/**
 * Split array into multi chunks
 * @param arr the array data
 * @param size chunks size
 */
export const arrayChunk = <T>(arr: T[], size: number): T[][] => {
  const arrRanage = arrayPad([], Math.ceil(arr.length / size), '');
  return arrRanage.map((_, i) => arr.slice(size * i, size + size * i));
};
