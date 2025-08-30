import { readFileSync } from 'node:fs';

export const resolveVersion = () => {
  const packageJson = readFileSync(
    new URL('../package.json', import.meta.url),
    'utf-8'
  );
  return JSON.parse(packageJson).version;
};
