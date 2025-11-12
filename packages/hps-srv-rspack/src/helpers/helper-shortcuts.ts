import readline from 'node:readline';
import { chalk } from '@hyperse/hps-srv-common';
import { openPage } from './helper-open-page.js';

export type RspackDevServer = {
  mainPage: string;
};

export type BindCLIShortcutsOptions<Server = RspackDevServer> = {
  /**
   * Print a one-line shortcuts "help" hint to the terminal
   */
  print?: boolean;
  /**
   * Custom shortcuts to run when a key is pressed. These shortcuts take priority
   * over the default shortcuts if they have the same keys (except the `h` key).
   * To disable a default shortcut, define the same key but with `action: undefined`.
   */
  customShortcuts?: CLIShortcut<Server>[];
};

export type CLIShortcut<Server = RspackDevServer> = {
  key: string;
  description: string;
  action?(server: Server): void | Promise<void>;
};

export function bindCLIShortcuts<Server extends RspackDevServer>(
  server: Server,
  opts?: BindCLIShortcutsOptions<Server>
): void {
  if (!process.stdin.isTTY || process.env.CI) {
    return;
  }

  if (opts?.print) {
    console.info(
      chalk(['dim'])(chalk(['green'])('  ➜')) +
        chalk(['dim'])('  press ') +
        chalk(['bold'])('h + enter') +
        chalk(['dim'])(' to show help')
    );
  }

  const shortcuts = (opts?.customShortcuts ?? []).concat(BASE_DEV_SHORTCUTS);

  let actionRunning = false;

  const onInput = async (input: string) => {
    if (actionRunning) return;

    if (input === 'h') {
      const loggedKeys = new Set<string>();
      console.info('\n  Shortcuts');

      for (const shortcut of shortcuts) {
        if (loggedKeys.has(shortcut.key)) continue;
        loggedKeys.add(shortcut.key);

        if (shortcut.action == null) continue;

        console.info(
          chalk(['dim'])('  press ') +
            chalk(['bold'])(`${shortcut.key} + enter`) +
            chalk(['dim'])(` to ${shortcut.description}`)
        );
      }

      return;
    }

    const shortcut = shortcuts.find((shortcut) => shortcut.key === input);
    if (!shortcut || shortcut.action == null) return;

    actionRunning = true;
    await shortcut.action(server);
    actionRunning = false;
  };

  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', onInput);
  process.on('exit', () => rl.close());
}

const BASE_DEV_SHORTCUTS: CLIShortcut[] = [
  {
    key: 'u',
    description: 'show server url',
    action(server) {
      console.info(`debug page ➩ ${chalk(['cyan'])(server.mainPage)}`);
    },
  },
  {
    key: 'o',
    description: 'open in browser',
    action(server) {
      openPage(server.mainPage);
    },
  },
  {
    key: 'c',
    description: 'clear console',
    action() {
      const repeatCount = process.stdout.rows - 2;
      const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
      console.log(blank);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
    },
  },
  {
    key: 'q',
    description: 'quit',
    async action() {
      process.exit();
    },
  },
];
