import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    testTimeout: 5000 * 10000,
    // The serve pipeline suites bind real sockets and download schemas inside
    // `beforeAll`; give hooks a bounded timeout so a failure surfaces instead of
    // hanging the worker indefinitely.
    hookTimeout: 5000 * 10000,
    // Integration suites hold listening sockets, so never run files in parallel
    // within a single run.
    fileParallelism: false,
    exclude: [...configDefaults.exclude],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
});
