export interface RspackWatchOptions {
  /**
   * Delay the rebuilt after the first change. Value is a time in ms.
   */
  aggregateTimeout?: number;

  /**
   * Resolve symlinks and watch symlink and real file. This is usually not needed as webpack already resolves symlinks ('resolve.symlinks').
   */
  followSymlinks?: boolean;

  /**
   * Ignore some files from watching
   */
  ignored?: string[];

  /**
   * Enable polling mode for watching.
   */
  poll?: number | boolean;
}

export type ForgeTsCheckerOptions = {
  /**
   * The current working directory
   */
  projectCwd?: string;

  /**
   * Whether to run the ts checker
   * @default true
   */
  runTsChecker?: boolean;

  /**
   * Whether to start the serve
   */
  serveMode: boolean;

  /**
   * Options for the watcher.
   */
  watchOptions?: RspackWatchOptions;
};
