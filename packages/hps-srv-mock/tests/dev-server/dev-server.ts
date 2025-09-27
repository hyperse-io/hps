import { getDirname } from '@armit/file-utility';
import { logger, requireResolve } from '@hyperse/hps-srv-common';
import { loadMockConfigFile } from '../../src/index.js';
import { startMock } from '../../src/main/start-mock.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

const newMockOptions = await loadMockConfigFile(projectCwd, {
  projectCwd: projectCwd,
  resolve: requireResolve,
});

startMock(projectCwd, newMockOptions)
  .then((domain) => {
    logger.info(`${domain}`);
  })
  .catch((err: any) => {
    console.log(err);
  });
