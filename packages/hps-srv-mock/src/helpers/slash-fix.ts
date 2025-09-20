/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not extended-length paths.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 * @param path
 * @returns
 */
export const slashFix = (path: string) => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
};
