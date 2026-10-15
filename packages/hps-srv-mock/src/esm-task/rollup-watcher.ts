import { createPathsMatcher, getTsconfig } from 'get-tsconfig';
import { existsSync } from 'node:fs';
import { builtinModules, isBuiltin } from 'node:module';
import { dirname, join } from 'node:path';
import {
  type InputOption,
  type OutputOptions,
  type Plugin,
  type RollupOptions,
  type RollupWatcher,
  watch,
} from 'rollup';
import type { PackageJson } from 'type-fest';
import { ensureSlash } from '@armit/file-utility';
import * as pluginCommonjsModule from '@rollup/plugin-commonjs';

/**
 * The factory signature `@rollup/plugin-commonjs` declares in its own
 * `types/index.d.ts` (`export default function commonjs(options?)`).
 */
type CommonjsPluginFactory = (options?: { [key: string]: unknown }) => Plugin;

/**
 * `@rollup/plugin-commonjs` ships a single `types/index.d.ts` declaring
 * `export default function commonjs(...)`, but its `exports` map lists the
 * `types` condition unconditionally. Under `moduleResolution: NodeNext` that
 * makes TypeScript treat the declarations as CommonJS, and with
 * `verbatimModuleSyntax` enabled both the default import and the namespace's
 * `.default` are typed as the module namespace object (non-callable), even
 * though at runtime the factory is exposed directly:
 *  - ESM: `export { commonjs as default }`
 *  - CJS: `module.exports = Object.assign(exports.default, exports)`
 *
 * So we resolve the default and re-assert the callable signature the package
 * itself declares.
 */
const pluginCommonjs = (
  pluginCommonjsModule as unknown as { default: CommonjsPluginFactory }
).default;

/**
 * Rollup output configuration used by the mock transform watcher.
 */
export interface MockWatcherOutputOptions {
  /**
   * The output directory, relative to `projectCwd` when not absolute.
   */
  distFolder: string;
  /**
   * The rollup output format.
   * @default 'esm'
   */
  format?: OutputOptions['format'];
  /**
   * Preserve the module structure of the input files.
   * @default false
   */
  preserveModules?: boolean;
  /**
   * Controls the naming of the emitted chunk files.
   */
  entryFileNames?: OutputOptions['entryFileNames'];
  /**
   * Controls the naming of the emitted shared chunks.
   */
  chunkFileNames?: OutputOptions['chunkFileNames'];
}

export interface MockWatcherOptions {
  /**
   * The project root directory.
   */
  projectCwd: string;
  /**
   * The entry files to transform. Absolute paths.
   */
  input: string[];
  /**
   * Modules which should stay external and never be bundled.
   */
  externalModules: Array<RegExp | string>;
  /**
   * The rollup output configuration.
   */
  output: MockWatcherOutputOptions;
  /**
   * Additional rollup plugins appended after the built-in ones.
   */
  extraPlugins?: Plugin[];
  /**
   * The `package.json` of the project, used to derive external dependencies.
   */
  packageJson?: PackageJson;
  /**
   * Rollup watcher options.
   * @default undefined
   */
  watchOptions?: RollupOptions['watch'];
}

/**
 * Collect every dependency name declared in the `package.json`.
 *
 * These are treated as external so the mock transform never bundles the
 * consuming project's runtime dependencies.
 */
const prepareExternalModules = (
  allDependencies: Record<string, unknown>
): string[] => {
  return Object.keys(allDependencies)
    .filter(Boolean)
    .filter((element, index, self) => index === self.indexOf(element));
};

/**
 * Indicate which modules should be treated as external.
 * @param externalModules the external modules we have known from package.json
 * @param moduleId which module we need to verify.
 */
export const isExternalModule = (
  externalModules: Array<RegExp | string>,
  moduleId: string
): boolean => {
  if (builtinModules.includes(moduleId) || isBuiltin(moduleId)) {
    return true;
  }
  // `@scope/module`
  const isScopeModule = /@.+\/.+/.test(moduleId);

  // Note while we use `@flatjs/babel-plugin-import` it will transform `@dimjs/utils` to precise down to the module level
  // e.g. import { classNames } from '@dimjs/utils'; will be use transform to.
  // import _classNames from '@dimjs/utils/esm/class-names'; we should flag `@dimjs/utils/esm/class-names` to external.
  if (isScopeModule) {
    return (
      // `@scope/module` exact match
      externalModules.includes(moduleId) ||
      // `@scope/.*`
      // moduleId: `@dimjs/utils/esm/class-names`
      !!externalModules.find((externalModule) => {
        if (typeof externalModule === 'string') {
          return moduleId.startsWith(ensureSlash(externalModule, true));
        }
        return externalModule.test(moduleId);
      })
    );
  }
  // `react`, `react-shadow-scope`
  // Treat it as external modules when the `moduleId` is defined as dependencies, or it is node builtin modules.
  const isExternal =
    externalModules.includes(moduleId) ||
    externalModules.find((externalModule) => {
      if (typeof externalModule === 'string') {
        return (
          externalModule === moduleId ||
          moduleId.startsWith(ensureSlash(externalModule, true))
        );
      }
      return externalModule.test(moduleId);
    });

  return !!isExternal;
};

/**
 * Resolve `compilerOptions.paths` aliases declared in the project `tsconfig.json`.
 *
 * The mock definition files rely on aliases such as `@/utils` and the package
 * self-reference `@hyperse/hps-srv-mock`, which rollup cannot resolve on its
 * own. This replaces `@flatjs/forge-plugin-ts-paths`, but uses `get-tsconfig`
 * instead of TypeScript so it does not depend on the TS compiler API.
 *
 * It additionally maps relative `*.js` / `*.mjs` / `*.cjs` specifiers onto
 * their TypeScript sources. The project (and its fixtures) are authored for
 * `moduleResolution: nodenext`, so relative imports are written with an
 * explicit `.js` extension while the actual file on disk is `.ts`. Rollup has
 * no built-in `.js` -> `.ts` remapping (that normally comes from
 * `@rollup/plugin-node-resolve`, which this watcher intentionally avoids), so
 * without this the transform fails with:
 *
 *   Could not resolve "./get-str.js" from "src/utils/index.ts"
 *
 * @param projectCwd the root directory of the project.
 */
export const tsConfigPathsPlugin = (projectCwd: string): Plugin => {
  const tsconfig = getTsconfig(projectCwd);
  const matcher = tsconfig ? createPathsMatcher(tsconfig) : null;

  /**
   * Given a candidate path, try to locate the real module on disk, allowing a
   * `.js`-style specifier to resolve to its TypeScript source.
   */
  const resolveCandidate = (candidate: string): string | null => {
    if (existsSync(candidate)) {
      return candidate;
    }
    // `./get-str.js` -> `./get-str.ts` / `./get-str.tsx` / `./get-str.mts`
    const stripped = candidate.replace(/\.(js|jsx|mjs|cjs)$/, '');
    if (stripped !== candidate) {
      for (const ext of ['.ts', '.tsx', '.mts', '.cts']) {
        if (existsSync(`${stripped}${ext}`)) {
          return `${stripped}${ext}`;
        }
      }
    }
    // Extensionless `./get-str` -> `./get-str.ts` or `./get-str/index.ts`
    for (const ext of ['.ts', '.tsx', '.mts', '.cts']) {
      if (existsSync(`${candidate}${ext}`)) {
        return `${candidate}${ext}`;
      }
    }
    for (const ext of ['.ts', '.tsx', '.mts', '.cts']) {
      const asDir = join(candidate, `index${ext}`);
      if (existsSync(asDir)) {
        return asDir;
      }
    }
    return null;
  };

  return {
    name: 'hps-mock-tsconfig-paths',
    resolveId(importee, importer) {
      if (!importer) {
        return null;
      }
      // Relative / absolute specifiers are not tsconfig path aliases, but they
      // still need the `.js` -> `.ts` remapping described above.
      if (importee.startsWith('.') || importee.startsWith('/')) {
        const baseDir = importee.startsWith('/') ? '' : dirname(importer);
        return resolveCandidate(join(baseDir, importee));
      }
      if (!matcher) {
        return null;
      }
      const candidates = matcher(importee);
      for (const candidate of candidates) {
        const resolved = resolveCandidate(candidate);
        if (resolved) {
          return resolved;
        }
      }
      return null;
    },
  };
};

/**
 * Create a rollup watcher for the mock transform task.
 *
 * This is a self-contained replacement of `createRollupWatcher` from
 * `@flatjs/forge`. The forge barrel statically re-exports every plugin,
 * which transitively evaluates `@flatjs/forge-plugin-dts` and therefore
 * `dts-bundle-generator` at module load time. That dependency is broken
 * against `typescript@7`, so importing forge would crash the process even
 * though the mock transform never uses dts, babel, terser or the cleaner.
 */
export const createMockRollupWatcher = (
  options: MockWatcherOptions
): RollupWatcher => {
  const {
    input,
    output,
    externalModules,
    extraPlugins = [],
    packageJson = {},
    watchOptions,
    projectCwd,
  } = options;

  const { dependencies, peerDependencies, devDependencies, name } = packageJson;
  const pkgDeps = Object.assign(
    { [name || '']: '*' },
    dependencies,
    peerDependencies,
    devDependencies
  );
  const pkgExternalModules = prepareExternalModules(pkgDeps);
  const allExternalModules = externalModules.concat(pkgExternalModules);

  const rollupOutput: OutputOptions = {
    dir: output.distFolder,
    format: output.format || 'esm',
    preserveModules: output.preserveModules || false,
    entryFileNames: output.entryFileNames,
    chunkFileNames: output.chunkFileNames,
    sourcemap: false,
  };

  if (rollupOutput.format === 'cjs') {
    rollupOutput.exports = 'named';
  }

  return watch({
    input: input as InputOption,
    output: rollupOutput,
    watch: watchOptions,
    // Do not follow symlinks when resolving files.
    // Very important and useful for monorepo setups, always keep it `true`.
    preserveSymlinks: true,
    plugins: [
      // Mock definitions may be authored as CommonJS (e.g. `exports.foo = ...`
      // or `module.exports = ...`). Those files must be converted to ESM
      // before they are imported by the runner, otherwise Node throws
      // `ReferenceError: exports is not defined in ES module scope`.
      pluginCommonjs(),
      // Resolve `tsconfig.json` path aliases and `.js` -> `.ts` specifiers
      // before the extra plugins run.
      tsConfigPathsPlugin(projectCwd),
      ...extraPlugins,
    ],
    external: (id) => {
      // Indicate which modules should be treated as external.
      return isExternalModule(allExternalModules, id);
    },
  });
};
