import { showBanner } from '../utils/showBanner.js';

export const printBanner = async () => {
  await showBanner(`hyperse`, {
    align: 'left',
    gradient: 'gray,blue',
    letterSpacing: 1,
    font: 'simple',
  });
  console.log('  ✨ Next-Generation CLI • Powered by Hyperse');
};
