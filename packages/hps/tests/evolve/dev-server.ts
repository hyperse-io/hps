import { getDirname } from '@armit/file-utility';
import { testCli } from '../test-cli.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

await testCli.parse(['serve', 'evolve', '--projectCwd', projectCwd]);
