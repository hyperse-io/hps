import { join } from 'node:path';
import { getDirname } from '@armit/file-utility';
import { cli } from '../../src/index.js';
import { createTestLoadConfig } from '../create-test-load-config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const tsconfig = join(projectCwd, '../../../tsconfig.json');

cli.use(createTestLoadConfig({ tsconfig }));
await cli.parse(['serve', 'evolve', '--projectCwd', projectCwd]);
