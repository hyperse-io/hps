---
'@hyperse/hps-srv-mock': patch
---

Replace `@flatjs/forge` with a self-contained rollup watcher so the mock
transform no longer pulls in the broken `dts-bundle-generator` chain.

`@flatjs/forge` is a static barrel that re-exports every plugin it ships, so
merely importing it evaluates `@flatjs/forge-plugin-dts` and therefore
`dts-bundle-generator` at module load time. `dts-bundle-generator` resolves
`typescript` through the range `>=5.0.2`, which now hoists a nested
`typescript@7`. TypeScript 7 exposes `lib/version.cjs` as its main entry, so
`ts.sys` is `undefined` and `dts-bundle-generator` throws while the module is
still being evaluated:

```
TypeError: Cannot read properties of undefined (reading 'getCurrentDirectory')
  at Object.<anonymous> node_modules/dts-bundle-generator/dist/helpers/check-diagnostics-errors.js:8:33
```

Because the failure happened during module evaluation, it crashed every process
that transitively imported `@hyperse/hps-srv-mock` — including the entire
`@hyperse/hps-srv-rspack` test suite, which died before vitest could even
collect test files. The mock transform never used dts, babel, terser, the
cleaner or multi-input (all were disabled via `dts: false`,
`babelOptions: false`, `terserOptions: false`, `cleanDistFolder: false`), so
none of that code was ever needed.

`packages/hps-srv-mock/src/esm-task/rollup-watcher.ts` now builds the rollup
watcher directly, reusing the same external-module rules and the same
`preserveSymlinks: true` behaviour. `compilerOptions.paths` aliases such as
`@/utils` and the `@hyperse/hps-srv-mock` self-reference are resolved with
`get-tsconfig`'s `createPathsMatcher` instead of `@flatjs/forge-plugin-ts-paths`,
which removes the last dependency on the TypeScript compiler API.

The former forge config also set
`pluginConfigs.nodeResolveOptions.extensions` to
`['.js', '.ts', '.mjs', '.cjs', '.mts', '.cts', '.json']`, which is what let
`@rollup/plugin-node-resolve` remap a relative `./foo.js` specifier onto the
`.ts` file actually on disk. The mock definitions (and the package sources) are
authored for `moduleResolution: nodenext`, so relative imports carry an explicit
`.js` extension while the files are `.ts`. This watcher intentionally avoids
`@rollup/plugin-node-resolve`, so the equivalent behaviour is now implemented in
`tsConfigPathsPlugin`: relative specifiers are resolved against the importer's
directory, trying the literal path first, then `.js`/`.jsx`/`.mjs`/`.cjs`
stripped to `.ts`/`.tsx`/`.mts`/`.cts`, then the extensionless and
`index.*` forms. Without this, `yarn serve` aborted with:

```
RollupError: Could not resolve "./get-str.js" from "src/utils/index.ts"
```

`tests/rollup-watcher.spec.ts` covers both the resolver contract and the real
bundle traversal of the `@/utils` -> `./get-str.js` -> `get-str.ts` chain.

This drops all 11 `@flatjs/*` packages plus `dts-bundle-generator` from the
dependency tree. Two plugins that forge used to inject are now declared and
wired explicitly, because dropping them silently changed output:

- `@rollup/plugin-commonjs` — mock definition files may be authored as
  CommonJS (`module.exports = ...` or `exports.foo = ...`). Without the
  conversion step they were emitted verbatim into `.mjs` files, so importing
  them threw `ReferenceError: exports is not defined in ES module scope` at
  startup.
- `rollup` is now a direct dependency, since it was previously only reachable
  transitively through forge.

The transform output directory is also anchored to `projectCwd` rather than
left relative. `createRollupOutputDir` used to join `projectCwd` for us;
passing a relative `distFolder` straight to rollup's `output.dir` made rollup
resolve it against `process.cwd()`, so the bundles landed outside the `.cache`
root that `getMockCacheDir` cleans and reads. The two only coincided when the
process happened to run with `cwd === projectCwd`. `createWatcherOptions` now
builds the path from `getMockCacheDir` so the writer and the reader cannot
drift apart.
