/**
 * @description
 * Convert string to PascalCase format
 */
export const toPascalCase = (str: string) => {
  return (str || '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '');
};
