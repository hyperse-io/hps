import { getCliPackage } from '../../../hps/src/utils/getCliPackage.js';

/**
 * Get the version of the CLI
 * @returns The version of the CLI
 */
export const getCliVersion = async () => {
  const packageJson = await getCliPackage();
  return packageJson?.version;
};
