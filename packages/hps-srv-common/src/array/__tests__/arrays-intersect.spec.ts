import { arraysIntersect } from '../arrays-intersect.js';

describe('array intersect()', () => {
  it('works with any element of arr1 appears in arr2.', () => {
    expect(arraysIntersect([1, 2], [3, 4])).toBe(false);
    expect(arraysIntersect([1, 3], [3, 4])).toBe(true);
    expect(arraysIntersect([1, 3, 3], [3, 4])).toBe(true);
    expect(arraysIntersect([3, 4], [3, 4])).toBe(true);
  });
});
