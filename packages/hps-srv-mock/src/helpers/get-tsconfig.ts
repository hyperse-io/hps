import { getTsconfig as _getTsconfig, parseTsconfig } from 'get-tsconfig';
import path from 'path';

export const getTsconfig = (
  projectCwd: string = process.cwd(),
  tscFile?: string
) => {
  if (!tscFile) {
    return _getTsconfig(projectCwd);
  }

  const resolvedTscFile = path.resolve(projectCwd, tscFile);
  const config = parseTsconfig(resolvedTscFile);
  return {
    path: resolvedTscFile,
    config,
  };
};
