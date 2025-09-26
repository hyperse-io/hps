import { HPS_MOCK_GRAPHQL_SERVICES_PREFIX } from '../constants.js';

export const getGqlServiceUrl = () => {
  const gqlServices: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(HPS_MOCK_GRAPHQL_SERVICES_PREFIX) && value) {
      const serviceName = key.replace(HPS_MOCK_GRAPHQL_SERVICES_PREFIX, '');
      if (serviceName) {
        gqlServices[serviceName] = value;
      }
    }
  }
  return gqlServices;
};
