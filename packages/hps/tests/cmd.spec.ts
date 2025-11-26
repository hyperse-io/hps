import { cli } from '../src/index.js';

const printer = vi.fn();
const originalPrinter = process.stdout.write;

const consolePrinter = vi.fn();
const originalConsolePrinter = console.log;

describe('test cmd', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.stdout.write = printer;
    console.log = consolePrinter;
  });

  afterEach(() => {
    process.stdout.write = originalPrinter;
    console.log = originalConsolePrinter;
  });

  it('test help cmd', async () => {
    await cli.parse(['-h']);
    expect(printer).toHaveBeenCalled();
    let result = printer.mock.calls;
    let hasResult = result.map((msg) => msg[0])[0];
    expect(hasResult).toContain('hps help          Show help information');
    expect(hasResult).toContain('hps version       Show CLI version');
    expect(hasResult).toContain(
      'hps info          Show hyperse cli system information'
    );
    expect(hasResult).toContain('hps deploy        Deploying Static Assets');
    expect(hasResult).toContain(
      'hps update        Updating Workspace Packages'
    );
    expect(hasResult).toContain('hps build         Building hps application');
    expect(hasResult).toContain('hps serve         Serving hps application');
    expect(hasResult).toContain('hps mock          Start a mock service');

    printer.mockClear();
    await cli.parse(['build', '-h']);
    expect(printer).toHaveBeenCalled();
    result = printer.mock.calls;
    hasResult = result.map((msg) => msg[0])[0];
    expect(hasResult).toContain('Building hps application');
    expect(hasResult).toContain(
      'hps build evolve    Build hps application using @hyperse/hps-srv-rspack for web`'
    );

    printer.mockClear();
    await cli.parse(['build', 'evolve', '-h']);
    expect(printer).toHaveBeenCalled();
    result = printer.mock.calls;
    hasResult = result.map((msg) => msg[0])[0];
    console.log(hasResult);

    expect(hasResult).toContain(
      'Build hps application using @hyperse/hps-srv-rspack for web`'
    );
    expect(hasResult).toContain('hps build evolve [flags]');
    expect(hasResult).toContain('hps build evolve --compress --modules home');
    expect(hasResult).toContain(
      '-c, --compress  [boolean]    If true, it will be NODE_ENV=development, no minify, maybe has sourceMap'
    );
    expect(hasResult).toContain(
      '-m, --modules   [value]      Filter you un wanted entry items, make we have best serve & debug performance'
    );

    printer.mockClear();
    await cli.parse(['serve', 'evolve', '-h']);
    expect(printer).toHaveBeenCalled();
    result = printer.mock.calls;
    hasResult = result.map((msg) => msg[0])[0];

    expect(hasResult).toContain(
      'Serving hps application using @hyperse/hps-srv-rspack for web`'
    );
    expect(hasResult).toContain('hps serve evolve [flags]');
    expect(hasResult).toContain(
      'hps serve evolve --static-mode --modules home'
    );
    expect(hasResult).toContain(
      '-s, --static-mode   [boolean]    Start an evolve serve with static mode'
    );
    expect(hasResult).toContain(
      '-m, --modules       [value]      Filter you un wanted entry items, make we have best serve & debug performance'
    );
    expect(hasResult).toContain(
      '--mock-filters  [value]      The filter `regex` will ignore some set of mock files at serve startup '
    );
  });

  it('test info cmd', async () => {
    await cli.parse(['info']);
    expect(consolePrinter).toHaveBeenCalled();
    const result = consolePrinter.mock.calls;
    const hasResult = result.map((msg) => msg[0])[1];
    expect(hasResult).toContain('Next-Generation CLI • Powered by Hyperse');
  });

  it('test did you mean', async () => {
    try {
      await cli.parse(['serve', 'evolve2']);
    } catch {
      // do nothing
    }
    expect(printer.mock.calls[0][0]).toBeDefined();
    expect(printer.mock.calls[0][0]).toContain(
      'Command "serve evolve2" not found. Did you mean "serve evolve"? '
    );

    printer.mockClear();
    try {
      await cli.parse(['build', 'evolve', 'mini']);
    } catch {
      // do nothing
    }
    expect(printer.mock.calls[0][0]).toBeDefined();
    expect(printer.mock.calls[0][0]).toContain(
      'Command "build evolve mini" not found. Did you mean "build evolve"? '
    );
  });
});
