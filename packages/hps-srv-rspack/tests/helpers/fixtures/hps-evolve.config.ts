import { defineConfig } from '@hyperse/hps-srv-rspack';

export default defineConfig(() => {
  // const serveMode = env.command === 'serve';
  return {
    webpack: {
      enableBundleHashName: false,
    },
    entryMap: {
      home: {
        entry: ['src/home/index.tsx'],
        options: {
          inlineScripts: [],
          allowPx2rem: false,
          externals: {
            antd: 'antd',
          },
          title: 'home',
        },
      },
      mine: {
        entry: ['src/mine/index.tsx'],
        options: {
          allowPx2rem: false,
          title: 'mine',
        },
      },
    },
  };
});
