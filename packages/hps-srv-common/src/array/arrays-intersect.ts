/**
 * Returns true if any element of arr1 appears in arr2.
 */
export function arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.reduce((intersects, role) => {
    return intersects || arr2.includes(role);
  }, false as boolean);
}
