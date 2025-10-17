import { getDirname } from '@armit/file-utility';
import { checkNodeModules } from './test-utils.js';

const projectCwd = getDirname(import.meta.url, 'reactjs/fixtures');

await checkNodeModules(projectCwd);
