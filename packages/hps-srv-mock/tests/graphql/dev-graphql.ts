import express from 'express';
import { getDirname } from '@armit/file-utility';
import { attachGraphqlServe } from '../../src/main/attach-graphql-serve.js';

const testCwd = getDirname(import.meta.url, 'fixtures');
const app = express();

await attachGraphqlServe(app, {
  projectCwd: testCwd,
  apiContext: '/api',
  graphqlMockMap: {
    'vendure-dashboard-admin-api': {
      apiPath: '/admin-api',
      url: 'http://localhost:4090/admin-api',
      mocks: {},
    },
    'vendure-dashboard-shop-api': {
      apiPath: '/shop-api',
      url: 'http://localhost:4090/shop-api',
      mocks: {
        JSON: () => '{"name":"John Doe"}',
      },
    },
  },
});

app.listen(6080, () => {
  console.log('http://localhost:6080');
});
