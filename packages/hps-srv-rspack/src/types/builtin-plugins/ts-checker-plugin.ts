export interface TsCheckerPluginOptions {
  /**
   * Whether to enable the ts checker plugin
   * @default true
   */
  enabled?: boolean;

  /**
   * Run `tsc --build` for project-reference solution tsconfigs (monorepo dev hosts).
   * @default false
   */
  build?: boolean;
}
