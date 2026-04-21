import { join } from 'node:path';
import { createResolve } from '../../src/core/create-resolve.js';

describe('core/create-resolve', () => {
  it('should override resolve.tsConfig', () => {
    const projectCwd = '/tmp/my-project';

    let resolved = createResolve(projectCwd, {
      tsConfig: {
        configFile: join(projectCwd, 'tsconfig.custom.json'),
        references: 'auto',
      },
    });

    expect(resolved.tsConfig).toEqual({
      configFile: join(projectCwd, 'tsconfig.custom.json'),
      references: 'auto',
    });

    resolved = createResolve(projectCwd, {
      tsConfig: join(projectCwd, 'tsconfig.custom.json'),
    });

    expect(resolved.tsConfig).toBe(join(projectCwd, 'tsconfig.custom.json'));
  });

  it('should keep default resolve.tsConfig when not provided', () => {
    const projectCwd = '/tmp/my-project';

    const resolved = createResolve(projectCwd);

    expect(resolved.tsConfig).toEqual({
      configFile: join(projectCwd, 'tsconfig.json'),
    });
  });
});
