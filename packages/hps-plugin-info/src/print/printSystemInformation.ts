import { platform, release } from 'node:os';
import osName from 'os-name';
import { terminalColor } from '../utils/terminalColor.js';

/**
 * Print system information
 * @param noColor Whether to print in color
 */
export const printSystemInformation = (options: { noColor?: boolean }) => {
  console.info('');
  console.info(
    terminalColor(['dim'], options.noColor)('  ✔ System Information')
  );
  console.info(
    '   OS Version     :',
    terminalColor(
      ['blue'],
      options.noColor
    )(` ${osName(platform(), release())}`)
  );
  console.info(
    '   NodeJS Version :',
    terminalColor(['blue'], options.noColor)(` ${process.version}`)
  );
};
