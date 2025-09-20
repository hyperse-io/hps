/**
 * Get the maximum order of the items
 * @param items
 * @returns
 */
export const getHtmlMaxOrder = <T extends { order: number }>(items: T[]) => {
  return items.length > 0 ? Math.max(...items.map((item) => item.order)) : 0;
};

/**
 * Get the minimum order of the items
 * @param items - The items to get the minimum order
 * @returns The minimum order
 */
export const getHtmlMinOrder = <T extends { order: number }>(items: T[]) => {
  return items.length > 0 ? Math.min(...items.map((item) => item.order)) : 0;
};
