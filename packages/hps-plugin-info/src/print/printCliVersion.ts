import type { PackageJson } from '../types.js';
import { terminalColor } from '../utils/terminalColor.js';

export const printCliVersion = async (options: {
  noColor?: boolean;
  cliPackage?: PackageJson;
}) => {
  const cliVersion = options.cliPackage?.version;
  console.info('');
  console.info(terminalColor(['dim'], options.noColor)('  ✔ @hyperse CLI'));
  console.info(
    '   @hyperse CLI Version :',
    terminalColor(['blue'], options.noColor)(`${cliVersion || ''}`),
    '\n'
  );
};
