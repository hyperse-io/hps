/**
 * Ensures a path string has the correct slash ending based on the specified options
 *
 * @param str - The path fragment to normalize
 * @param slashEndfix - Whether to keep a trailing slash at the end
 * @returns The normalized path string
 *
 * @example
 * ```typescript
 * ensureSlash('/path/to/dir/', true) // '/path/to/dir/'
 * ensureSlash('/path/to/dir/', false) // '/path/to/dir'
 * ensureSlash('C:\\path\\to\\dir\\', true) // 'C:\\path\\to\\dir\\' (Windows)
 * ```
 */
export const ensureSlash = (str: string, slashEndfix = false): string => {
  if (typeof str !== 'string') {
    throw new TypeError('Path must be a string');
  }

  // Remove existing trailing slashes
  const normalized = str.replace(/[/\\]+$/, '');

  // Automatically detect platform by checking if the path contains Windows-style backslashes
  const hasWindowsSlashes = /\\/.test(str);
  const slashChar = hasWindowsSlashes ? '\\' : '/';

  // Add trailing slash if requested
  return slashEndfix ? `${normalized}${slashChar}` : normalized;
};
