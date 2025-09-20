import { arrayChunk } from '../array-chunk.js';

describe('array/array-chunk', () => {
  it('works chunk simple level deep array', () => {
    expect(arrayChunk([1, 2, 3, 4, 5, 6], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
    expect(arrayChunk([], 2)).toEqual([]);
    expect(arrayChunk([1, 2, 3, 4, 5, 6, 7], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7],
    ]);
  });

  it('works chunk 2 level deep array', () => {
    expect(arrayChunk([1, [2, 3], 4, [5, 6, 8], 7], 2)).toEqual([
      [1, [2, 3]],
      [4, [5, 6, 8]],
      [7],
    ]);
  });
});
