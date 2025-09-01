import { getPackages } from '@manypkg/get-packages';

/**
 * Get the workspace packages
 * @param cwd The current working directory, repo root
 * @returns
 */
export async function getWorkspacePackages(
  cwd: string
): Promise<
  Map<string, { name: string; relativeDir: string; version: string }>
> {
  const { packages } = await getPackages(cwd);
  const sortedPackages: Array<
    [string, { name: string; relativeDir: string; version: string }]
  > = packages.map((x) => [
    x.dir,
    {
      dir: x.dir,
      name: x.packageJson.name,
      version: x.packageJson.version,
      relativeDir: x.relativeDir,
    },
  ]);
  // sort by package name
  sortedPackages.sort((a, b) => {
    if (a[1].name < b[1].name) {
      return -1;
    }
    if (a[1].name > b[1].name) {
      return 1;
    }
    return 0;
  });

  return new Map(sortedPackages);
}
