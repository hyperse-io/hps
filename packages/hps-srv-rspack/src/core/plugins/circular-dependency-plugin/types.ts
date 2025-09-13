import type { Compilation } from '@rspack/core';

export interface CircularDependencyOptions {
  /**
   * The project root.
   */
  projectCwd?: string;
  /**
   * exclude detection of files based on a RegExp
   * @default  /node_modules/
   */
  exclude?: RegExp;
  /**
   * include specific files based on a RegExp
   * @default `new RegExp('.*')`
   */
  include?: RegExp;
  /**
   * add errors to webpack instead of warnings
   * @default false
   */
  failOnError?: boolean;
  /**
   * allow import cycles that include an asynchronous import,
   * e.g. via via import(/* webpackMode: "weak" *\/ './file.js')
   * @default false
   */
  allowAsyncCycles?: boolean;
  /**
   * `onStart` is called before the cycle detection starts
   */
  onStart?: (options: { compilation: Compilation }) => void;
  /**
   * `onDetected` is called for each module that is cyclical
   *  `paths` will be an Array of the relative module paths that make up the cycle
   */
  onDetected?: (options: { paths: string[]; compilation: Compilation }) => void;
  /**
   * `onEnd` is called before the cycle detection ends
   */
  onEnd?: (options: { compilation: Compilation }) => void;
}
