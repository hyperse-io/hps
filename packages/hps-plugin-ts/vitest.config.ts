import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    exclude: [...configDefaults.exclude],
    testTimeout: 10000 * 5000,
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
