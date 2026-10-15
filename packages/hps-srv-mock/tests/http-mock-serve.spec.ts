import express from 'express';
import { buildSchema, graphql } from 'graphql';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { Server } from 'node:http';
import http from 'node:http';
import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { getAvailableDomain } from '@hyperse/hps-srv-common';
import { loadMockConfigFile } from '../src/load-config/load-mock-config-file.js';
import { attachMockMiddlewares } from '../src/main/attach-mock-middlewares.js';

/**
 * End-to-end HTTP tests for the `@hyperse/hps-srv-mock` serve pipeline.
 *
 * These mirror what `yarn serve` does in `tests/dev-server/dev-server.ts`, but
 * assemble the express app in-process (the same steps `startMock` performs) so
 * the suite can close the listener afterwards and assert against real HTTP
 * responses. The rollup watch transform, the action cache, the REST
 * middlewares, the static routing and the graphql apollo servers are all
 * exercised for real.
 *
 * Three details matter for parity with the CLI:
 *  1. `yarn serve` runs with `tests/dev-server/fixtures` as its cwd. Rollup
 *     resolves the relative `output.dir` (`.cache/<watcherId>`) against
 *     `process.cwd()`, so we chdir to keep bundle writes consistent with the
 *     paths the action cache imports back.
 *  2. The mock server binds `0.0.0.0` and advertises `http://<hostname>:<port>`,
 *     where `hostname` defaults to a `.dev` alias that may not resolve. Requests
 *     therefore target `127.0.0.1` on the advertised port; express routes purely
 *     on the path.
 *  3. GraphQL mocks need a live upstream: the introspection schema is downloaded
 *     from `endpoint.url` when the server starts. The fixture config points at
 *     unreachable `localhost:40xx` services, so this suite points a single
 *     endpoint at an in-process stub GraphQL server.
 */
const fixturesCwd = getDirname(import.meta.url, 'dev-server/fixtures');

/**
 * Pick an ephemeral free port from the OS instead of hardcoding one, so a stray
 * `yarn serve` (or a parallel vitest worker) can never make this suite fail with
 * `EADDRINUSE` and strand the process on the hook timeout.
 */
const getFreePort = async (): Promise<number> => {
  const { createServer } = await import('node:net');
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.unref();
    probe.on('error', reject);
    probe.listen(0, '0.0.0.0', () => {
      const address = probe.address();
      if (!address || typeof address === 'string') {
        probe.close();
        reject(new Error('Unable to allocate a free port'));
        return;
      }
      const { port } = address;
      probe.close(() => resolve(port));
    });
  });
};

/** Time allowed for the initial rollup transform + action cache flush. */
const READY_TIMEOUT = 30_000;
const POLL_INTERVAL = 250;

type MockResponseBody = {
  code: string;
  message: string;
  data?: unknown;
};

let server: Server | undefined;
let upstreamServer: Server | undefined;
let baseUrl = '';
let originalCwd = '';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const request = async (
  path: string,
  init: RequestInit = {}
): Promise<{ status: number; contentType: string | null; body: string }> => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    // `connection: close` avoids leaving pooled sockets that keep vitest from
    // exiting once the server is closed.
    headers: { connection: 'close', ...(init.headers || {}) },
  });
  return {
    status: response.status,
    contentType: response.headers.get('content-type'),
    body: await response.text(),
  };
};

const requestJson = async (
  path: string,
  init?: RequestInit
): Promise<MockResponseBody> => {
  const { body } = await request(path, init);
  return JSON.parse(body) as MockResponseBody;
};

const postJson = (path: string, payload: unknown) =>
  requestJson(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

/**
 * The rollup transform is asynchronous, so poll until a known mock resolves
 * rather than sleeping for a fixed, arbitrary duration.
 */
const waitUntilMockReady = async () => {
  const deadline = Date.now() + READY_TIMEOUT;
  while (Date.now() < deadline) {
    try {
      const result = await postJson('/api/export-function/exportAction', {});
      if (result.code === '0000') {
        return;
      }
    } catch {
      // Server may not be listening yet.
    }
    await sleep(POLL_INTERVAL);
  }
  throw new Error(
    `Mock service did not become ready within ${READY_TIMEOUT}ms`
  );
};

/**
 * Poll `/api/other` until the served `data.name` equals `expected`, returning
 * the matched payload. Used by the hot-update suite to observe real transitions.
 */
const waitForValue = async (
  expected: string
): Promise<MockResponseBody | undefined> => {
  const deadline = Date.now() + READY_TIMEOUT;
  while (Date.now() < deadline) {
    try {
      const current = await requestJson('/api/other');
      if ((current.data as { name?: string } | undefined)?.name === expected) {
        return current;
      }
    } catch {
      // Watcher may be mid-rebuild; retry.
    }
    await sleep(POLL_INTERVAL);
  }
  return undefined;
};

beforeAll(async () => {
  originalCwd = process.cwd();
  // Parity with `yarn serve` (cwd === fixtures dir).
  process.chdir(fixturesCwd);

  // `loadMockConfigFile` is the same loader the CLI uses; it merges the user
  // config (`hps-mock.config.ts`) on top of the defaults.
  const mockOptions = await loadMockConfigFile(fixturesCwd, {
    projectCwd: fixturesCwd,
    resolve: (id: string) => id,
  });

  const upstreamPort = await getFreePort();

  // The fixture graphql endpoints target unreachable `localhost:40xx` services.
  // Point a single endpoint at a local stub so the introspection download (and
  // therefore the apollo mock server) actually succeeds offline.
  const upstreamSchema = buildSchema(`
    type Query { me: User }
    type User { id: ID!, name: String! }
  `);
  upstreamServer = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', async () => {
      try {
        const { query, variables } = JSON.parse(raw || '{}');
        const result = await graphql({
          schema: upstreamSchema,
          source: query,
          variableValues: variables,
        });
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ errors: [{ message: String(error) }] }));
      }
    });
  });
  await new Promise<void>((resolve) =>
    upstreamServer!.listen(upstreamPort, '0.0.0.0', () => resolve())
  );

  mockOptions.graphqlMockMap = {
    'hps/shop-api': {
      endpoints: {
        'dev-serve': {
          priority: 1,
          url: `http://127.0.0.1:${upstreamPort}/graphql`,
          customMocks: {},
          strategy: 'bypass',
        },
      },
      enableMocking: true,
    },
  } as never;

  mockOptions.port = await getFreePort();

  const { port, hostUri } = await getAvailableDomain({
    port: mockOptions.port,
    hostname: mockOptions.hostname,
    isHttps: !!mockOptions.https,
  });

  const app = express();
  await attachMockMiddlewares(app, mockOptions as never, { hostUri, port });

  server = await new Promise<Server>((resolve) => {
    const listener = app.listen(port, '0.0.0.0', () => resolve(listener));
  });

  baseUrl = hostUri.replace(/https?:\/\/[^:]+:/, 'http://127.0.0.1:');

  await waitUntilMockReady();
}, 120_000);

afterAll(async () => {
  // Close both listeners even if one of them failed to start, otherwise vitest
  // keeps the worker alive and the process never exits.
  await Promise.all(
    [server, upstreamServer].map(
      (target) =>
        new Promise<void>((resolve) => {
          if (!target) {
            resolve();
            return;
          }
          target.closeAllConnections?.();
          target.close(() => resolve());
        })
    )
  );
  if (originalCwd) {
    process.chdir(originalCwd);
  }
}, 30_000);

describe('mock serve pipeline (REST)', () => {
  describe('@mockable() class exports', () => {
    it('serves an `@alias` decorated method from a named export', async () => {
      const body = await postJson('/api/export-class/export-named-class', {});

      expect(body.code).toBe('0000');
      // `getStr` comes from the `@/utils` barrel — the alias chain that used to
      // fail rollup resolution.
      expect(body.message).toBe('getStr: export named @mockable () class');
      expect(body.data).toEqual({
        cachedData: 'default-class',
        values: ['ddd'],
      });
    });

    it('serves a default export class', async () => {
      const body = await postJson('/api/export-class/export-default-class', {
        xxx: { name: 'hps', pwd: 1 },
        sex: 'm',
        famale: 0,
      });

      expect(body.code).toBe('0000');
      expect(String(body.message)).toContain(
        'export default @mockable () class'
      );
      expect(String(body.message)).toContain('["1","2","3"]');
    });

    it('serves a plain instance export without `@mockable()`', async () => {
      const body = await postJson(
        '/api/export-class/new-instance-export-named-class',
        {}
      );

      expect(body.code).toBe('0000');
      expect(String(body.message)).toContain('without @mockable()');
    });
  });

  describe('function exports', () => {
    it('serves a named function export', async () => {
      const body = await requestJson('/api/export-function/exportAction');

      expect(body.code).toBe('0000');
      expect(body.message).toBe('export function exportAction(...){...}');
    });

    it('serves a default export object member without a slash prefix', async () => {
      const body = await requestJson(
        '/api/export-function/getExportDefaultFn1'
      );

      expect(body.code).toBe('0000');
      expect(body.message).toBe('export default {...}');
    });

    it('serves a `slash` prefixed key of a default export object', async () => {
      const body = await requestJson(
        '/api/export-function/getExportDefaultFn2'
      );

      expect(body.code).toBe('0000');
      expect(body.message).toBe('export default {...}');
    });
  });

  describe('commonjs module exports', () => {
    it('serves a `module.exports` map', async () => {
      const body = await requestJson('/api/module-exports/moduleExports');

      expect(body.code).toBe('0000');
      expect(body.message).toBe('module.exports = {...}');
    });

    it('serves `exports.fn` assignments', async () => {
      const body = await requestJson('/api/module-exports/exportsFunction');

      expect(body.code).toBe('0000');
      expect(body.message).toBe('exports.exportsFunction = {...}');
    });
  });

  describe('FUNC_SIMPLE generated data', () => {
    // `FUNC_SIMPLE` defs are selected via `protocol.functionCode` in the body,
    // not via the URL path.
    it('serves mockjs-generated payloads', async () => {
      const body = await postJson('/api/function-code', {
        protocol: { functionCode: 'queryProductList' },
      });

      expect(body.code).toBe('0000');
      expect(body.message).toBe('queryProductList');
      const data = body.data as Record<string, string>;
      expect(Object.keys(data)).toEqual(
        expect.arrayContaining(['cname', 'datetime', 'email', 'guid'])
      );
      // mockjs templates must be expanded, not returned verbatim.
      expect(data.email).toMatch(/@/);
      expect(data.cname).not.toBe('@cname');
    });

    it('serves each registered function code independently', async () => {
      const body = await postJson('/api/function-code', {
        protocol: { functionCode: 'queryProductListItem' },
      });

      expect(body.code).toBe('0000');
      expect(body.message).toBe('queryProductListItem');
    });

    it('falls back to NOT_FOUND for an unregistered function code', async () => {
      const body = await postJson('/api/function-code', {
        protocol: { functionCode: 'notExistFunction' },
      });

      expect(body.code).toBe('NOT_FOUND');
    });
  });

  describe('wildcard routing', () => {
    // `/*` defs are matched by the flattened action name, so `/api/other` maps
    // to `@alias('other')`.
    it('routes unmatched paths to the `/*` defs', async () => {
      const body = await requestJson('/api/other');

      expect(body.code).toBe('0000');
      expect(body.message).toBe('other');
      // `data.name` is intentionally NOT asserted: the hot-update suite mutates
      // this fixture file, and vitest hoists `describe` bodies so the two suites
      // observe each other's writes. Assert the shape instead.
      expect(body.data).toEqual(
        expect.objectContaining({ name: expect.any(String) })
      );
    });
  });

  describe('static assets', () => {
    it('serves files from `staticMap`', async () => {
      const response = await fetch(`${baseUrl}/static/banner.png`, {
        headers: { connection: 'close' },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('image/png');

      const buffer = Buffer.from(await response.arrayBuffer());
      // PNG magic bytes: 89 50 4E 47.
      expect(buffer.subarray(0, 4)).toEqual(
        Buffer.from([0x89, 0x50, 0x4e, 0x47])
      );
    });
  });

  describe('unmapped requests', () => {
    it('responds with a NOT_FOUND payload for unknown actions', async () => {
      const body = await requestJson('/api/export-function/notExistAction');

      // Unknown actions inside a *matched* context surface as NOT_FOUND while
      // the request itself still succeeds at the HTTP level.
      expect(body.code).toBe('NOT_FOUND');
    });
  });
});

describe('mock serve pipeline (GraphQL)', () => {
  // GraphQL mocks mount under the api context: `/api/<service>/<endpoint>`.
  const graphqlUrl = '/api/hps/shop-api/dev-serve';

  it('mounts an apollo server for the configured endpoint', async () => {
    const { status, body } = await request(graphqlUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    });

    expect(status).toBe(200);
    const parsed = JSON.parse(body);
    expect(parsed.data.__typename).toBe('Query');
  });

  it('fills generated mocks for schema fields', async () => {
    const { status, body } = await request(graphqlUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ me { id name } }' }),
    });

    expect(status).toBe(200);
    const parsed = JSON.parse(body);
    expect(parsed.errors).toBeUndefined();
    // `@graphql-tools/mock` fills scalars, so `me` resolves to a mocked object.
    expect(parsed.data.me).toBeTruthy();
    expect(parsed.data.me.id).toBeTruthy();
    expect(typeof parsed.data.me.name).toBe('string');
  });
});

describe('mock serve pipeline (hot update)', () => {
  const targetFile = join(fixturesCwd, 'mocks', 'others', 'orther.ts');
  const exclusiveMarker = 'hot-updated';
  const baselineMarker = 'other';

  /**
   * The fixture can be left dirty by an interrupted run, so normalize the
   * mutable field back to the committed baseline instead of trusting whatever
   * is on disk.
   */
  const writeMarker = (marker: string) => {
    const current = readFileSync(targetFile, 'utf-8');
    writeFileSync(
      targetFile,
      current.replace(/name:\s*'[^']*'/, `name: '${marker}'`),
      'utf-8'
    );
  };

  beforeAll(() => {
    writeMarker(baselineMarker);
  });

  afterAll(() => {
    // Always restore the fixture so the repo stays clean.
    writeMarker(baselineMarker);
  });

  it('picks up mock file edits and returns fresh results', async () => {
    // Wait until the baseline is the served value before mutating, so we are
    // observing a real transition rather than a stale cached payload.
    await waitForValue(baselineMarker);
    const initial = await requestJson('/api/other');
    expect(initial.code).toBe('0000');
    expect((initial.data as { name?: string }).name).toBe(baselineMarker);

    try {
      // Mutate the fixture: change the mocked payload.
      writeMarker(exclusiveMarker);

      const updated = await waitForValue(exclusiveMarker);
      expect(updated).toBeDefined();
      expect(updated?.data).toEqual({ name: exclusiveMarker });
    } finally {
      // Restore immediately so sibling suites never observe the mutated value.
      writeMarker(baselineMarker);
    }
  }, 120_000);

  it('keeps the regenerated bundles on disk in the mock cache dir', () => {
    // Sanity check that the transform actually emitted bundles rather than
    // serving everything from memory.
    expect(existsSync(join(fixturesCwd, '.cache'))).toBe(true);
  });
});
