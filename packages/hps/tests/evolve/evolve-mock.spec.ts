import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { cli } from '../../src/index.js';
import { createTestLoadConfig } from '../create-test-load-config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const publicCwd = join(projectCwd, 'public');

const printer = vi.fn();
const originalPrinter = process.stdout.write;

describe('test build evolve modules', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = printer;
  });

  afterEach(() => {
    process.stdout.write = originalPrinter;
  });

  beforeAll(async () => {
    if (existsSync(publicCwd)) {
      rmSync(publicCwd, { recursive: true, force: true });
    }
  });

  it('test build evolve modules', async () => {
    cli.use(createTestLoadConfig());
    await cli.parse(['mock', '--projectCwd', projectCwd]);

    expect(printer).toHaveBeenCalled();
    const result = printer.mock.calls;

    const hasResult = result.some((msg) =>
      msg[0].includes('Start an mock service on "http://dev.hps.com')
    );
    expect(hasResult).toBe(true);
  });
});
