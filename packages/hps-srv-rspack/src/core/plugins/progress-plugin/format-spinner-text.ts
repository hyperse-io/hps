import { chalk } from '@hyperse/hps-srv-common';

/**
 * Formats the spinner text by adding prefixes and styling using chalk.
 *
 * @param strArr - An array of strings to be formatted.
 * @param prefixCode - The prefix to replace default prefix code.
 * @param prefixColor - The color of the prefix.
 * @returns The formatted spinner text.
 */
export const formatSpinnerText = (
  strArr: string[] = [],
  prefixCode?: string,
  prefixColor?: Parameters<typeof chalk>[0][number]
): string => {
  if (strArr.length === 1) {
    return `  ${chalk([prefixColor || 'blue'])(prefixCode || '●')} ${strArr[0]} \n`;
  }
  const str = strArr.map((entryKey, index) => {
    let code = '├';
    if (index === 0) {
      code = '┌';
    } else if (index === strArr.length - 1) {
      code = '└';
    }
    return `  ${chalk([prefixColor || 'blue'])(prefixCode || code)} ${entryKey} \n`;
  });

  return str.join('');
};
