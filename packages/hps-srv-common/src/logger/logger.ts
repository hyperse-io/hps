import { createLogger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';
import type { Logger } from '@hyperse/wizard';

class CommonLogger {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      name: 'hps logger',
      thresholdLevel: LogLevel.Info,
    })
      .use(createStdoutPlugin())
      .build();
  }

  public setupCommonLogger(wizardLogger: Logger) {
    this.logger = wizardLogger;
  }

  public getLogger(): Logger {
    return this.logger;
  }
}

export const commonLogger = new CommonLogger();

export const logger = new Proxy({} as Logger, {
  get(_target, prop) {
    const currentLogger = commonLogger.getLogger();
    const value = (currentLogger as any)[prop];
    return typeof value === 'function' ? value.bind(currentLogger) : value;
  },
});
