import { getDirname } from '@armit/file-utility';
import { createTsService } from './ts-service.js';

const projectCwd = getDirname(import.meta.url, 'fixtures');

const tsService = createTsService({
  projectCwd,
  outputDir: 'dist',
  graphql: {
    'admin-api': {
      schemas: [
        {
          name: 'dashboard-admin-api',
          schema: 'http://localhost:4090/admin-api',
        },
        {
          name: 'metrics-admin-api',
          schema: 'http://localhost:4060/admin-api',
        },
      ],
    },
    'shop-api': {
      schemas: [
        {
          name: 'dashboard-shop-api',
          schema: 'http://localhost:4090/shop-api',
        },
        {
          name: 'metrics-shop-api',
          schema: 'http://localhost:4060/shop-api',
        },
      ],
    },
  },
});
tsService.getSemanticDiagnostics('example.ts');
