import { transform } from 'esbuild';
import { resolve } from 'node:path';
import { type OutputChunk, type Plugin, rollup } from 'rollup';
import { getDirname } from '@armit/file-utility';
import { tsConfigPathsPlugin } from '../src/esm-task/rollup-watcher.js';

/**
 * The fixture project mirrors the real `hps-mock` layout:
 *
 *   fixtures/
 *     tsconfig.json          -> `@/utils` => `./src/utils/index.ts`
 *     src/index.ts           -> `export * from './utils/index.js'`
 *     src/utils/index.ts     -> `export * from './get-str.js'`
 *     src/utils/get-str.ts   -> the concrete implementation
 *     mocks/export-class/named-class.ts -> `import { getStr } from '@/utils'`
 *
 * Both relative hops are written with an explicit `.js` extension (the
 * `moduleResolution: nodenext` convention) while the files on disk are `.ts`.
 * Rollup cannot remap `.js` -> `.ts` on its own, which used to abort the mock
 * transform with:
 *
 *   RollupError: Could not resolve "./get-str.js" from "src/utils/index.ts"
 *
 * `tsConfigPathsPlugin` is what performs that remapping, so the assertions
 * below deliberately check that the implementation is *inlined into the
 * bundle* rather than merely that the specifier appears somewhere.
 */
const fixturesCwd = getDirname(import.meta.url, 'dev-server/fixtures');

/** Only bare node_modules / builtins stay external, so the fixture graph is bundled. */
const isExternalSpecifier = (id: string): boolean => {
  return (
    /^(lodash|mockjs|express|class-validator|class-transformer)$/.test(id) ||
    id.startsWith('@armit/') ||
    id.startsWith('@hyperse/') ||
    id.startsWith('node:') ||
    id.includes('/node_modules/')
  );
};

/** Minimal TS transform because the fixture sources are TypeScript. */
const tsTransformPlugin: Plugin = {
  name: 'test-esbuild-transform',
  async transform(code, id) {
    if (!/\.tsx?$/.test(id)) {
      return null;
    }
    const result = await transform(code, { loader: 'ts', format: 'esm' });
    return { code: result.code, map: null };
  },
};

const bundleFixture = async (relativeEntry: string) => {
  const warnings: string[] = [];
  const bundle = await rollup({
    input: resolve(fixturesCwd, relativeEntry),
    plugins: [tsConfigPathsPlugin(fixturesCwd), tsTransformPlugin],
    external: isExternalSpecifier,
    onwarn(warning) {
      warnings.push(String(warning.code));
    },
  });
  const { output } = await bundle.generate({ format: 'esm' });
  await bundle.close();
  return {
    code: (output as OutputChunk[]).map((chunk) => chunk.code).join('\n'),
    warnings,
  };
};

describe('tsConfigPathsPlugin', () => {
  describe('relative `.js` specifiers pointing at TypeScript sources', () => {
    it('inlines the `@/utils` alias chain that re-exports `./get-str.js`', async () => {
      // `@/utils` -> `src/utils/index.ts` -> `export * from './get-str.js'`
      //           -> `src/utils/get-str.ts`   (the hop that used to fail)
      const { code, warnings } = await bundleFixture(
        'mocks/export-class/named-class.ts'
      );

      // The concrete implementation must be bundled, proving the `.js` -> `.ts`
      // remapping happened instead of the import being left dangling.
      expect(code).toContain('getStr: ');
      // No unresolved module should be left behind.
      expect(code).not.toContain('get-str.js');
      expect(warnings).not.toContain('UNRESOLVED_IMPORT');
    });

    it('resolves the `@hyperse/hps-srv-mock` self-reference graph', async () => {
      // `orther.ts` imports the package barrel mapped to `../../../src/index.ts`,
      // which is a large graph of relative `./x.js` -> `./x.ts` hops.
      const { code } = await bundleFixture('mocks/others/orther.ts');

      expect(code).toContain('MockService');
    });
  });

  describe('resolveId behaviour', () => {
    const plugin = tsConfigPathsPlugin(fixturesCwd) as Plugin;
    const resolveId = plugin.resolveId as (
      importee: string,
      importer: string | undefined
    ) => string | null;
    const importer = resolve(fixturesCwd, 'src/utils/index.ts');

    it('maps `./get-str.js` to `./get-str.ts`', () => {
      expect(resolveId('./get-str.js', importer)).toBe(
        resolve(fixturesCwd, 'src/utils/get-str.ts')
      );
    });

    it('maps `./index.js` to `./index.ts`', () => {
      expect(resolveId('./index.js', importer)).toBe(
        resolve(fixturesCwd, 'src/utils/index.ts')
      );
    });

    it('resolves an extensionless relative specifier', () => {
      expect(resolveId('./get-str', importer)).toBe(
        resolve(fixturesCwd, 'src/utils/get-str.ts')
      );
    });

    it('resolves a tsconfig `paths` alias', () => {
      expect(resolveId('@/utils', importer)).toBe(
        resolve(fixturesCwd, 'src/utils/index.ts')
      );
    });

    it('returns null for a missing relative module so rollup can fall through', () => {
      expect(resolveId('./does-not-exist.js', importer)).toBeNull();
    });

    it('returns null for bare externals', () => {
      expect(resolveId('node:fs', importer)).toBeNull();
      expect(resolveId('rollup', importer)).toBeNull();
    });

    it('returns null when there is no importer', () => {
      expect(resolveId('../foo.js', undefined)).toBeNull();
    });
  });
});
