import stringWidth from 'string-width';
import { chalk } from '@hyperse/hps-srv-common';

export function printGqlServices(title: string, lines: string[]) {
  const maxLen = Math.max(
    stringWidth(title),
    ...lines.map((l) => stringWidth(l))
  );

  const width = maxLen + 4;

  const top = '┌' + '─'.repeat(width - 2) + '┐';
  const bottom = '└' + '─'.repeat(width - 2) + '┘';
  const separator = '├' + '─'.repeat(width - 2) + '┤';

  const padVisible = (s: string, len: number) => {
    const diff = len - stringWidth(s);
    return s + ' '.repeat(Math.max(0, diff));
  };

  console.log(chalk(['cyan'])(top));
  console.log(chalk(['cyan'])(`│ ${padVisible(title, maxLen)} │`));
  console.log(chalk(['cyan'])(separator));
  for (const line of lines) {
    console.log(chalk(['cyan'])(`│ ${padVisible(line, maxLen)} │`));
  }
  console.log(chalk(['cyan'])(bottom));
}
