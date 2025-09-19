import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { requireResolve } from '@hyperse/hps-srv-common';
import { createConfigLoaderOptions } from '@hyperse/hps-srv-testing';
import { loadMockConfigFile } from '../../src/index.js';
import { startMock } from '../../src/main/start-mock.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');

const configLoaderOptions = await createConfigLoaderOptions(
  tsconfig,
  'hps-mock'
);
const newMockOptions = await loadMockConfigFile(
  projectCwd,
  {
    projectCwd: projectCwd,
    resolve: requireResolve,
  },
  configLoaderOptions
);

startMock(projectCwd, newMockOptions).catch((err) => {
  console.log(err);
});
