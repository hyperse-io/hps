import { readFileSync } from 'node:fs';

export const readJsonFromFile = (str: string) => {
  return JSON.parse(readFileSync(str, 'utf-8'));
};
