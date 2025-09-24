export interface DefineVariablesPluginOptions {
  /**
   * The DefinePlugin replaces variables in your code with other values or expressions at compile time.
   * @default
   * ```ts
   * `process.env.HPS_PUBLIC_SERVE_MODE`
   * `process.env.HPS_PUBLIC_BUILD_DATE`
   * ```
   */
  variables?: Record<string, unknown>;
}
