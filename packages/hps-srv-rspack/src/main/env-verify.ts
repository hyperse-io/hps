import {
  illegalPackageChecker,
  keepPackageDepsUpToDateForNonMonoRepo,
} from '@armit/package';
import { type HpsEvolveOptions } from '../types/types-options.js';

export const envVerify = async (
  projectCwd: string,
  evolveOptions: HpsEvolveOptions
) => {
  const { packageInstallChecker, needVerifyPackages } = evolveOptions;

  if (packageInstallChecker !== false && packageInstallChecker?.enabled) {
    // Verify local install node modules
    await illegalPackageChecker({
      cwd: projectCwd,
      modules: packageInstallChecker?.detectModules,
      throwError: packageInstallChecker?.throwError,
      showAllInstalledGraph: packageInstallChecker?.showAllInstalledGraph,
    });
  }

  if (needVerifyPackages !== false) {
    // Keep package deps up to date for non-monorepo
    await keepPackageDepsUpToDateForNonMonoRepo({
      cwd: projectCwd,
      autoUpgrade: true,
      needVerifyPackages: needVerifyPackages || {},
    });
  }
};
