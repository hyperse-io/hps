import { posix, sep } from 'node:path';

/**
 * This function normalizes the platform path.
 * On Windows, it replaces backslashes with forward slashes and removes the drive letter from the path.
 * On other platforms, it does not modify the path.
 *
 * @param pathStr - The path string to be normalized.
 * @param newSep - The new separator. default is `sep` for unit test.
 * @returns The normalized path string.
 */
export const normalizePlatformPath = (
  pathStr: string,
  newSep: string = sep
): string => {
  return pathStr.split(newSep).join(posix.sep);
};
