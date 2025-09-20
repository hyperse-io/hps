import chokidar, { type ChokidarOptions, type FSWatcher } from 'chokidar';
import { platform } from 'node:os';
import { type WatchTask } from './watch-task.js';

export type ChangeEvent = 'create' | 'update' | 'delete';

export class FileWatcher {
  private readonly task: WatchTask;
  private readonly watcher: FSWatcher;
  private readonly chokidarOptions: ChokidarOptions;

  constructor(task: WatchTask, chokidarOptions: ChokidarOptions) {
    this.task = task;
    this.chokidarOptions = chokidarOptions;
    this.watcher = this.createWatcher();
  }

  close(): void {
    this.watcher.close();
  }

  unwatch(id: string): void {
    this.watcher.unwatch(id);
  }

  watch(id: string): void {
    this.watcher.add(id);
  }

  private createWatcher(): FSWatcher {
    const task = this.task;
    const isLinux = platform() === 'linux';
    const handleChange = (id: string, event: ChangeEvent) => {
      const changedId = id;
      if (isLinux) {
        // unwatching and watching fixes an issue with chokidar where on certain systems,
        // a file that was unlinked and immediately recreated would create a change event
        // but then no longer any further events
        watcher.unwatch(changedId);
        watcher.add(changedId);
      }
      task.invalidate(changedId, { event });
    };

    const watcher = chokidar
      .watch([], this.chokidarOptions)
      .on('add', (id) => handleChange(id, 'create'))
      .on('change', (id) => handleChange(id, 'update'))
      .on('unlink', (id) => handleChange(id, 'delete'));

    return watcher;
  }
}
