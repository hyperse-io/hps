import { getDirname } from '@armit/file-utility';
import { chalk, logger, requireResolve } from '@hyperse/hps-srv-common';
import { getGqlServiceUrl, loadMockConfigFile } from '../../src/index.js';
import { startMock } from '../../src/main/start-mock.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

const newMockOptions = await loadMockConfigFile(projectCwd, {
  projectCwd: projectCwd,
  resolve: requireResolve,
});

startMock(projectCwd, newMockOptions)
  .then((domain) => {
    const gqlServices = getGqlServiceUrl();
    for (const [key, value] of Object.entries(gqlServices)) {
      logger.info(`${key}: ${chalk(['cyan'])(`${domain}${value}`)}`);
    }
  })
  .catch((err: any) => {
    console.log(err);
  });
