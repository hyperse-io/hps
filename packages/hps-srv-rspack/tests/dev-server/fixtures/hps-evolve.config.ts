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
    loader: {},
  },
}));
