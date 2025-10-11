import type { HpsMockOptions } from '../types/types-options.js';

export const formatEndpointName = (mockOptions: HpsMockOptions) => {
  const allGraphqlMockMap = Object.values(mockOptions?.graphqlMockMap || {});

  const rawNames: {
    name: string;
    content: string;
  }[] = [];
  allGraphqlMockMap.forEach((item) => {
    const endpoints = item?.endpoints;
    if (endpoints) {
      for (const [name, config] of Object.entries(endpoints)) {
        rawNames.push({
          name,
          content: `${name} (${config?.strategy})`,
        });
      }
    }
  });

  const maxLength = rawNames.reduce(
    (max, current) => Math.max(max, current.content.length),
    0
  );

  const endpointNames: Record<string, string> = {};
  rawNames.forEach((item) => {
    endpointNames[item.name] = item.content.padEnd(maxLength, ' ');
  });

  return endpointNames;
};
