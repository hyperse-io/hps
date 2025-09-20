import { type ChokidarOptions } from 'chokidar';
import { resolve } from 'node:path';
import { type ChangeEvent, FileWatcher } from './file-watcher.js';

type WatchTaskOptions = {
  chokidar: ChokidarOptions;
  paths: string[];
};

type EventHandler = (data: {
  event: ChangeEvent;
  id: string;
  relativeId: string;
}) => void;

export class WatchTask {
  private closed = false;
  private watched = new Set<string>();
  private filter: (id: string) => boolean;
  private readonly fileWatcher: FileWatcher;
  private readonly options: WatchTaskOptions;
  private handlers: Array<EventHandler> = [];

  constructor(options: WatchTaskOptions) {
    this.options = options;
    this.filter = (id: string) => !!id;
    this.fileWatcher = new FileWatcher(this, {
      ...options.chokidar,
      ignoreInitial: true,
    });
    this.addWatchFiles(this.options.paths);
  }

  addWatchFiles(paths: string[]) {
    if (this.closed) {
      return;
    }
    this.updateWatchedFiles(paths);
  }

  async close(): Promise<void> {
    this.closed = true;
    this.fileWatcher.close();
  }

  invalidate(id: string, details: { event: ChangeEvent }): void {
    const projectCwd = this.options.chokidar.cwd || process.cwd();
    for (const handler of this.handlers) {
      handler({
        event: details.event,
        id: resolve(projectCwd, id),
        relativeId: id,
      });
    }
  }

  async addEventListener(...callbacks: EventHandler[]) {
    for (const handler of callbacks) {
      const index = callbacks.findIndex(
        (existedHandler) => handler === existedHandler
      );
      if (~index) {
        this.handlers.splice(index, 1);
      }
      this.handlers.push(handler);
    }
  }

  private updateWatchedFiles(watchFiles: ReadonlyArray<string>) {
    const previouslyWatched = this.watched;
    this.watched = new Set();
    for (const id of watchFiles) {
      this.watchFile(id);
    }

    for (const id of previouslyWatched) {
      if (!this.watched.has(id)) {
        this.fileWatcher.unwatch(id);
      }
    }
  }

  private watchFile(id: string) {
    if (!this.filter(id)) {
      return;
    }
    this.watched.add(id);
    this.fileWatcher.watch(id);
  }
}
