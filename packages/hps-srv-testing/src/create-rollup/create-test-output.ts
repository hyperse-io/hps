import { join } from 'node:path';
import { type OutputOptions } from 'rollup';

export type OutputInputOptions = {
  projectCwd: string;
  builtToCwd?: string;
  output: Pick<
    OutputOptions,
    | 'format'
    | 'manualChunks'
    | 'sourcemap'
    | 'chunkFileNames'
    | 'sourcemapBaseUrl'
    | 'preserveModules'
  > & {
    distFolder: string;
    umdModuleName?: string;
  };
};
export const createTestOutput = (
  options: OutputInputOptions
): OutputOptions => {
  const { projectCwd, builtToCwd, output } = options;
  const rollupOutput: OutputOptions = {
    dir: `${builtToCwd || projectCwd}/${output.distFolder}`,
    name: output.umdModuleName,
    indent: true,
    extend: true,
    format: output.format,
    strict: false,
    manualChunks: output.manualChunks,
    chunkFileNames: output.chunkFileNames,
    sourcemap: output.sourcemap || false,
    sourcemapBaseUrl: output.sourcemapBaseUrl,
    preserveModules: output.preserveModules || false,
    preserveModulesRoot: output.preserveModules
      ? join(projectCwd, 'src')
      : undefined,
  };

  if (output.format === 'cjs') {
    rollupOutput.exports = 'named';
  }
  return rollupOutput;
};
