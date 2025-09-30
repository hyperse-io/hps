import { join } from 'path';
import { getDirname } from '@armit/file-utility';
import { createTsService } from './ts-service.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');
const outputDir = join(projectCwd, 'dist');

const tsService = createTsService({
  projectCwd,
  outputDir: outputDir,
});
tsService.getSemanticDiagnostics('example.ts');
