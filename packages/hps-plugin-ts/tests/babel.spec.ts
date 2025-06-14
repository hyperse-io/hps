import { join, relative } from 'path/posix';
import { TRACE_SOURCE } from '@hyperse/inspector-common';
import inspectorBabelPlugin from '../src/index.js';
import { babelCompile, getDirname } from './utils/index.js';

describe(`tests preset babel react`, () => {
  it('should correct support array spread', () => {
    const filePath = getDirname(import.meta.url, './fixtures/react.tsx');
    const compiledCode = babelCompile(filePath)?.code;
    expect(compiledCode?.indexOf(`_toConsumableArray(children).`)).not.toBe(-1);
  });
});

describe(`tests preset babel react, inject inspector source`, () => {
  const projectCwd = getDirname(import.meta.url, 'fixtures');
  it('should correct support array spread', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [
        [
          inspectorBabelPlugin,
          {
            projectCwd: projectCwd,
          },
        ],
      ],
    })?.code;

    expect(compiledCode?.trim()).toContain(`${TRACE_SOURCE}`);
    expect(compiledCode).toContain(
      `${relative(projectCwd, filePath)}:5:11:div`
    );
  });

  it('should correct support array spread with relative file name. projectCwd is default', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [
        [
          inspectorBabelPlugin,
          {
            projectCwd: process.cwd(),
          },
        ],
      ],
    })?.code;

    expect(compiledCode?.trim()).toContain(`${TRACE_SOURCE}`);
    expect(compiledCode).toContain(
      `${relative(process.cwd(), filePath)}:5:11:div`
    );
  });

  it('should correct support array spread with absolute file name', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [[inspectorBabelPlugin, {}]],
    })?.code;

    expect(compiledCode?.trim()).toContain(`${TRACE_SOURCE}`);
    expect(compiledCode).toContain(`${filePath}:5:11:div`);
  });
});
