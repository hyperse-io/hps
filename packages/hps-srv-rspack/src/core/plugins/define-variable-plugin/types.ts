export interface DefineVariablesOptions {
  /**
   * The DefinePlugin replaces variables in your code with other values or expressions at compile time.
   * @default `__SENTRY_DEBUG__`,`process.env.FLAT_BUILD_DATE`, `process.env.FLAT_COMMIT_HASH`, `process.env.FLAT_BRANCH_NAME`
   */
  variables?: Record<string, unknown>;
}
