import { getCliPackage } from '../utils/getCliPackage.js';
import { rightPad } from '../utils/rightPad.js';
import { terminalColor } from '../utils/terminalColor.js';

interface ProjectDependency {
  name: string;
  version: string;
  latestVersion?: string;
}

const collectNestDependencies = (dependencies: Record<string, unknown>) => {
  const hpsDependencies: Array<ProjectDependency> = [];
  Object.keys(dependencies).forEach((key) => {
    if (key.includes('@hyperse')) {
      hpsDependencies.push({
        name: `${key.replace(/@hyperse\//, '')} ➞ version`,
        version: dependencies[key] as string,
      });
    }
  });
  return hpsDependencies;
};

export const dependencyformat = (dependencies: ProjectDependency[]) => {
  const sorted = dependencies.sort(
    (dependencyA, dependencyB) =>
      dependencyB.name.length - dependencyA.name.length
  );
  // Maybe dependencies is an empty array.
  const length = sorted[0]?.name?.length;
  sorted.forEach((dependency) => {
    if (dependency.name.length < length) {
      dependency.name = rightPad(dependency.name, length);
    }
    dependency.name = dependency.name.concat(' :');
    dependency.version = dependency.version.replace(/\^|~/, '');
  });
  return sorted;
};

export const printDependency = async (noColor?: boolean) => {
  console.info(
    terminalColor(['green'], noColor)('  ✔ @hyperse Platform Information')
  );
  const packageJson = await getCliPackage();
  const dependencies: Record<string, unknown> = Object.assign(
    {},
    packageJson?.dependencies || {},
    packageJson?.devDependencies || {},
    packageJson?.peerDependencies || {}
  );
  const hpsDependencies = collectNestDependencies(dependencies);
  dependencyformat(hpsDependencies).forEach((dependency) =>
    console.info(
      '   ' + dependency.name,
      terminalColor(['magenta'], noColor)(`${dependency.version}`)
    )
  );
  console.info(' ');
};
