import { getDirname } from '@armit/file-utility';
import { checkNodeModules } from './test-utils.js';

export default async function setup() {
  const projectCwd = getDirname(import.meta.url, 'reactjs/fixtures');
  await checkNodeModules(projectCwd);
}
