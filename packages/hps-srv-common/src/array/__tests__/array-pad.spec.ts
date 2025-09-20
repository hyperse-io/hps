import { arrayPad } from '../array-pad.js';

describe('array/array-pad', () => {
  it('should returning arrays with a specific length by padding values', () => {
    expect(arrayPad([], 2, '*')).toEqual(expect.arrayContaining(['*', '*']));
    expect(arrayPad([], 2, '**')).toEqual(expect.arrayContaining(['**', '**']));
  });
});
