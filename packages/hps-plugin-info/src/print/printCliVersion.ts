import { getCliVersion } from '../utils/getCliVersion.js';
import { terminalColor } from '../utils/terminalColor.js';

export const printCliVersion = async (noColor?: boolean) => {
  const cliVersion = await getCliVersion();
  console.info('');
  console.info(terminalColor(['green'], noColor)('  ✔ @hyperse CLI'));
  console.info(
    '   hyperse CLI Version :',
    terminalColor(['magenta'], noColor)(`${cliVersion || ''}`),
    '\n'
  );
};
