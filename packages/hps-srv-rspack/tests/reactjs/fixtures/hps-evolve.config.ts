import { defineConfig } from '@hyperse/hps-srv-rspack';

export default defineConfig({
  entryMap: {
    'finance/connect-body/body': {
      entry: ['./src/body/index.tsx'],
      options: {},
    },
    'finance/connect-body/body-audit': {
      entry: ['./src/body-audit/index.tsx'],
      options: {},
    },
    circularPlugin: {
      entry: ['./src/circular-plugin/index.tsx'],
      options: {},
    },
    home: {
      entry: ['./src/home/index.tsx'],
      options: {},
    },
    mine: {
      entry: ['./src/mine/index.tsx'],
      options: {},
    },
    modular: {
      entry: ['./src/modular/index.ts'],
      options: {},
    },
    titleA: {
      entry: ['./src/title-a/index.tsx'],
      options: {},
    },
    titleA_child: {
      entry: ['./src/title-a/index.tsx'],
      options: {},
    },
    titleB: {
      entry: ['./src/title-b/index.tsx'],
      options: {},
    },
    titleB_child: {
      entry: ['./src/title-b/index.tsx'],
      options: {},
    },
    child: {
      entry: ['./src/parent/child/index.tsx'],
      options: {
        useRelativeAssetPath: true,
      },
    },
    provider: {
      // provider/service
      // make sure the provider module has `service` folder, HMR will invalid.
      // start `provider` module only to see the HMR effect.
      entry: ['./src/provider/index.tsx'],
      options: {},
    },
    library: {
      entry: ['./src/library/index.tsx'],
      options: {},
    },
    'parent/child2': {
      entry: ['./src/parent/child2/index.tsx'],
      options: {
        headScripts: (configData) => {
          // direct use random cdn of `env`
          return [{ id: 'script/parent/child2/envCdn', src: configData.envCdn, position: 'end' , order: 1}];
        },
      },
    },
  },
  rspack: {
    resolve: {
      alias: {
        '@': './src',
      },
    },
  },
  htmlCdn: 'https://hps.cdn.domain.com',
});
