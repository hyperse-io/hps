import { resolve } from 'node:path';

export const normalizeResolveAlias = (
  projectCwd: string,
  alias: Record<string, string> = {}
) => {
  for (const [symbol, path] of Object.entries(alias)) {
    alias[symbol] = resolve(projectCwd, path);
  }
  return alias;
};
