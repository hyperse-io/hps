import { readFileSync } from 'fs';
import type { BabelFileResult } from '@babel/core';
import type { TransformOptions } from '@babel/core';
import { transformSync } from '@babel/core';
import { reactBabelPreset } from './reactBabelPreset.js';

export function babelCompile(
  filePath: string,
  extraOptions: TransformOptions = {}
): BabelFileResult | null {
  const testCode = readFileSync(filePath).toString();
  const babelOption = Object.assign(
    {},
    reactBabelPreset('development')
  ) as TransformOptions;
  return transformSync(testCode, {
    filename: filePath,
    ...babelOption,
    ...extraOptions,
  });
}
