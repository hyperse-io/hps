export const assertPath = (...paths: string[]) => {
  return paths.join('/').replace(/\/\//g, '/');
};
