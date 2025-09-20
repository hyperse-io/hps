import _ from 'lodash';
import { readPackageData } from '@armit/package';
import { logger } from '@hyperse/hps-srv-common';
import { loadMockMapDefEntryFiles } from '../helpers/load-mock-map-defs.js';
import { type HpsMockOptions } from '../types/types-options.js';
import { cleanMockCacheDir } from './clean-mock-cache-dir.js';
import { WatcherManager } from './watcher-manager.js';

export const createMockWatcher = async (mockOptions: HpsMockOptions) => {
  const { projectCwd = process.cwd(), chunkSize, externals = [] } = mockOptions;

  const externalModules = _.uniq(
    externals.concat([
      /^@hyperse\/.*/,
      'mockjs',
      'lodash',
      'class-validator',
      'class-transformer',
    ])
  );

  logger.info(`Transform mock start...`);

  // Preparing mock environment.
  await cleanMockCacheDir(mockOptions);

  const packageJson = readPackageData({
    cwd: projectCwd,
  });

  // Print user mock filters configuration if have.
  if (mockOptions.mockFilters && mockOptions.mockFilters.length) {
    logger.info(
      `mockFilters: ${JSON.stringify(mockOptions.mockFilters, null, 2)}`
    );
  }

  const mockDefFiles = await loadMockMapDefEntryFiles(mockOptions);

  if (!mockDefFiles.length) {
    logger.warn(
      `No mock defs here, please check \`mockMap\` in your config file, then restart...`
    );
    return;
  } else {
    logger.info(`Found ${mockDefFiles.length} mock def files`);
  }

  // Start transform task to hook all mock files
  return new WatcherManager({
    chunkSize,
    projectCwd,
    externalModules,
    mockOptions,
    packageJson,
  }).start(mockDefFiles);
};
