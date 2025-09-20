import { SimpleHttpClient } from './simple-http-client.js';
import { type TestServer } from './test-server.js';

/**
 * @description
 * The return value of {@link createTestEnvironment}, containing the test server
 * and clients for the Shop API and Admin API.
 *
 * @docsCategory testing
 */
export interface TestEnvironment<T> {
  /**
   * @description
   * A Vendure server instance against which GraphQL requests can be made.
   */
  server: TestServer<T>;
  /**
   * @description
   * A Http client configured for the Admin API.
   */
  httpClient: SimpleHttpClient;
}

/**
 * @example
 * ```TypeScript
 * import { createTestEnvironment, testConfig } from '\@vendure/testing';
 *
 * describe('some feature to test', () => {
 *
 *   const { server, httpClient } = createTestEnvironment(testConfig);
 *
 *   beforeAll(async () => {
 *     await server.init({
 *         // ... server options
 *     });
 *   });
 *
 *   afterAll(async () => {
 *       await server.destroy();
 *   });
 *
 *   // ... end-to-end tests here
 * });
 * ```
 */
export async function createTestServer<T>(config: {
  port: number;
  baseUrl: string;
  testServer: () => Promise<TestServer<T>>;
}): Promise<TestEnvironment<T>> {
  const { port, testServer, baseUrl } = config;
  const server = await testServer();

  const httpClient = new SimpleHttpClient(
    `http://localhost:${port}/${baseUrl}`
  );

  return {
    server,
    httpClient,
  };
}
