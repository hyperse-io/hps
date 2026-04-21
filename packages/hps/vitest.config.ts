import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    testTimeout: 5000 * 10000,
    hookTimeout: 5000 * 10000,
    globalSetup: './tests/test-setup.ts',
    reporters: [['verbose', { summary: true }]],
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
