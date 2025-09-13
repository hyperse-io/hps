import { createLogger, LogLevel } from '@hyperse/logger';
import { createStdoutPlugin } from '@hyperse/logger-plugin-stdout';

// Create a logger with console output
const logger = createLogger({
  name: 'hps logger',
  thresholdLevel: LogLevel.Info,
})
  .use(createStdoutPlugin())
  .build();

export { logger };
