import { getDirname } from '@armit/file-utility';
import { cli } from '../../src/index.js';
import { createTestLoadConfig } from '../create-test-load-config.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

cli.use(createTestLoadConfig());
await cli.parse(['serve', 'evolve', '--projectCwd', projectCwd]);
