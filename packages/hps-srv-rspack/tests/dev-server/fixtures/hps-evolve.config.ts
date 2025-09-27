import { defineConfig } from '@hyperse/hps-srv-rspack';
import { moduleGlobal } from './mocks/index.js';

// Notes: We must direct `import` mjs module, don't using dynamic import `await import('./xxx')`
// because we need to bundle all dependencies into one `bundle`
export default defineConfig(() => ({
  entryMap: {  
    main: {
      entry: ['./src/main/index.tsx'],
      options: {},
    },
    home: {
      entry: ['./src/home/index.tsx'],
      options: {},
    },
    hmr: {
      entry: ['./src/hmr/index.tsx'],
      options: {},
    },
    hmrIframe: {
      entry: ['./src/hmrIframe/index.tsx'],
      options: {},
    },
    hmrLibrary: {
      entry: ['./src/hmrLibrary/index.tsx'],
      options: {},
    },
    dynamicImport: {
      entry: ['./src/dynamicImport/index.tsx'],
      options: {},
    },
  },
  devServer: {
    port: 4000,
    pageProxy: '/route',
    defaultServeGlobalData: async () => {
      return moduleGlobal();
    },
    mockOptions: {
      hostname: 'dev.hps.com',
      mockBaseDir: `./mocks`,
      port: 40000,
      chunkSize: 3,
      staticMap: {
        '/static': 'static',
      },
    graphqlMockMap: {
      'vendure-dashboard-admin-api': {
        apiPath: '/admin-api',
        url: 'http://localhost:4090/admin-api',
        mocks: {},
        skipMockFields: {
          'query':['activedTemplateByRoutePath'],
          'mutation':['addCustomersToGroup']
        },
        resolvers: {
          Query: {
            activeChannel: () => {
              return {
                name: 'activedTemplateByRoutePath',
                changelog: 'changelog',
              };
            },
          },
        },
      },
      'vendure-dashboard-shop-api': {
        apiPath: '/shop-api',
        url: 'http://localhost:4090/shop-api',
        mocks:   {},
        skipMockFields: {
          'query':['activePaymentMethods'],
          'mutation':['AddCustomersToGroup']
        }
      },
    },
    }
  },
  rspack:{
    externals:()=>{
      return {}
    },
    output: {
      chunkFileVirtualPath: 'runtime-chunks',
    },
    plugins: {
      htmlPlugin: {
        htmlCdn: 'http://dev.hps.com:4000/public',
      },
    },
  
  },
}));
