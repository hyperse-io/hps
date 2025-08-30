import { platform, release } from 'node:os';
import osName from 'os-name';
import { terminalColor } from '../utils/terminalColor.js';

/**
 * Print system information
 * @param noColor Whether to print in color
 */
export const printSystemInformation = (noColor?: boolean) => {
  console.info('');
  console.info(terminalColor(['green'], noColor)('  ✔ System Information'));
  console.info(
    '   OS Version     :',
    terminalColor(['magenta'], noColor)(` ${osName(platform(), release())}`)
  );
  console.info(
    '   NodeJS Version :',
    terminalColor(['magenta'], noColor)(` ${process.version}`)
  );
};
