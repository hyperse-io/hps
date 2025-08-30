import { getCliVersion } from '../utils/getCliVersion.js';
import { terminalColor } from '../utils/terminalColor.js';

export const printCliVersion = async (options: { noColor?: boolean }) => {
  const cliVersion = await getCliVersion();
  console.info('');
  console.info(terminalColor(['dim'], options.noColor)('  ✔ @hyperse CLI'));
  console.info(
    '   @hyperse CLI Version :',
    terminalColor(['blue'], options.noColor)(`${cliVersion || ''}`),
    '\n'
  );
};
