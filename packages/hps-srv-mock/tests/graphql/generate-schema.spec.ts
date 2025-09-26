import { getDirname } from '@armit/file-utility';
import { generatedSchema } from '../../src/graphql/generated-schema.js';

describe('Generate schema', () => {
  const testCwd = getDirname(import.meta.url, 'fixtures');
  it('should generate schema files', async () => {
    const schemaFiles = await generatedSchema({
      projectCwd: testCwd,
      graphqlMockMap: {
        'vendure-dashboard-admin-api': {
          url: 'http://localhost:4090/admin-api',
          mocks: {},
        },
        'vendure-dashboard-shop-api': {
          url: 'http://localhost:4090/shop-api',
          mocks: {},
        },
      },
    });
    expect(schemaFiles.length).toBe(2);
  });
});
