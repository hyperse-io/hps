import { createWatchOptions } from '../src/helpers/helper-create-watch-options.js';

describe('createWatchOptions', () => {
  it('should create watch options', () => {
    let watchOptions = createWatchOptions({
      serveMode: false,
      watchOptions: {},
    });
    expect(watchOptions).toEqual({
      ignored: ['**/node_modules', '**/mocks', '**/miniprogram'],
      poll: 1000,
      aggregateTimeout: 500,
    });

    watchOptions = createWatchOptions({
      serveMode: true,
      watchOptions: undefined,
    });
    expect(watchOptions).toEqual({
      ignored: ['**/node_modules', '**/mocks', '**/miniprogram'],
      poll: 1000,
      aggregateTimeout: 500,
    });

    watchOptions = createWatchOptions({
      serveMode: true,
      watchOptions: {
        ignored: ['a/b.js'],
        poll: 2000,
      },
    });
    expect(watchOptions).toEqual({
      ignored: ['a/b.js'],
      poll: 2000,
      aggregateTimeout: 500,
    });
  });
});
