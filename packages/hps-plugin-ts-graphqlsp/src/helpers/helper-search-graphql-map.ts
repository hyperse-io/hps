import type { GraphqlMockMap, HpsMockOptions } from '@hyperse/hps-srv-mock';
import { loadHpsConfigFile } from './helper-load-hps-config.js';

type HpsConfig = {
  [key: string]: object | ((args: object) => Promise<object>) | undefined;
};

const hspMockConfigKeys = ['serve.evolve', 'build.evolve', 'mock'];

export const searchGraphqlMap = async (
  config: HpsMockOptions
): Promise<GraphqlMockMap | undefined> => {
  const { projectCwd = process.cwd() } = config;
  try {
    const hpsConfig = await loadHpsConfigFile<HpsConfig>(projectCwd, {
      configFile: 'hps',
      loaderOptions: {
        externals: [/^@hyperse\/.*/],
        externalExclude: (moduleId: string | RegExp) => {
          return moduleId.toString().startsWith('@hyperse/');
        },
      },
    });

    if (!Object.keys(hpsConfig).length) {
      return;
    }

    let mockConfig: HpsMockOptions | undefined;

    for (const key of hspMockConfigKeys) {
      const config = hpsConfig[key as keyof HpsConfig];
      let configData;
      if (config) {
        if (typeof config === 'function') {
          configData = await config({});
        } else {
          configData = config;
        }
      }

      if (!configData) {
        continue;
      }
      if (key === 'mock') {
        mockConfig = configData;
      } else {
        mockConfig = configData?.['devServer']?.mockOptions;
      }

      if (mockConfig) {
        break;
      }
    }

    if (!mockConfig) {
      return;
    }

    const graphqlMockMap = mockConfig.graphqlMockMap;
    if (!graphqlMockMap) {
      return;
    }
    return graphqlMockMap;
  } catch {
    return;
  }
};
