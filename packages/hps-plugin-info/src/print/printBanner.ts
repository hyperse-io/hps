import { showBanner } from '../utils/showBanner.js';
import { terminalColor } from '../utils/terminalColor.js';

export const printBanner = async (noColor?: boolean) => {
  await showBanner(`flat`, {
    align: 'left',
    gradient: 'red,blue',
    letterSpacing: 3,
  });
  console.log(terminalColor(['magenta', 'bold'], noColor)(`  ⚡ HYPERSE ⚡`));
  console.log('    🚀 Next-Generation CLI Tool ');
  console.log('    ✨ Built with TypeScript • Powered by Hyperse');
};
