# @hyperse/hps-srv-ts-checker

TypeScript checking service and plugins for Rspack. It integrates `ts-checker-rspack-plugin`, adds friendly logging, code-frame highlighting, configurable watch options, and a guard that can fail the build on errors in non-serve mode.

- **Rspack integration**: Out-of-the-box with `ts-checker-rspack-plugin`, wired into Rspack builds.
- **Guard plugin**: `TsCheckerGuardPlugin` throws on errors and can stop the build in non-serve mode (configurable).
- **Code-frame highlighting**: Error output includes code frames for fast pinpointing of issues.
- **Friendly logging**: Uses `@hyperse/hps-srv-common` for consistent, readable logs.
- **Configurable watch**: Mergeable `watchOptions` (polling, ignored paths, aggregate timeout, etc.).
- **Standalone compiler helpers**: `createTsCheckerCompilerConfig` and `createTsCheckerCompiler` to bundle/run the checker separately.
- **Environment-aware**: Async checking in serve mode; sync with optional fail-fast in production builds.

## Installation

```bash
# yarn
yarn add -D @hyperse/hps-srv-ts-checker @rspack/core typescript
# npm
npm i -D @hyperse/hps-srv-ts-checker @rspack/core typescript
# pnpm
pnpm add -D @hyperse/hps-srv-ts-checker @rspack/core typescript
```
