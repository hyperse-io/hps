import { getDirname } from '@armit/file-utility';
import { createTsService } from './ts-service.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

const tsService = createTsService({
  projectCwd,
  outputDir: 'dist',
});
tsService.getSemanticDiagnostics('example.ts');
