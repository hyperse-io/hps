const mockOptions = {
  projectCwd: process.cwd(),
  graphqlMockMap: {
    'hps/admin-api': {
      endpoints: [
        {
          name: 'dashboard-admin-api',
          url: 'http://localhost:4090/admin-api',
          customMocks: {},
          priority: 3,
          strategy: 'bypass',
          strategyViolativeOperations: {
            query: ['activeAdministrator'],
            mutation: ['addCustomersToGroup'],
          },
        },
        {
          name: 'metrics-admin-api',
          url: 'http://localhost:4060/admin-api',
          customMocks: {},
          priority: 2,
          strategy: 'bypass',
          strategyViolativeOperations: {
            query: ['hpsMetricSummary'],
            mutation: [],
          },
        },
        {
          name: 'portal-admin-api',
          url: 'http://localhost:7001/admin-api',
          customMocks: {},
          strategy: 'mock',
          priority: 1,
          strategyViolativeOperations: {
            query: ['showcases'],
            mutation: ['login'],
          },
        },
      ],
      fallbackEndpoint: 'backup',
      enableMocking: true,
    },
    'hps/shop-api': {
      endpoints: [
        {
          name: 'dashboard-shop-api',
          url: 'http://localhost:4090/shop-api',
          customMocks: {},
          strategy: 'bypass',
          strategyViolativeOperations: {
            query: ['activePaymentMethods'],
            mutation: ['addCustomersToGroup'],
          },
        },
      ],
      fallbackEndpoint: 'backup',
      enableMocking: true,
    },
  },
};

const evolveOptions = {
  devServer: {
    port: 4000,
    mockOptions: mockOptions,
  },
};

export default {
  'build.evolve': () => {
    return Promise.resolve(evolveOptions);
  },
  'serve.evolve': () => {
    return evolveOptions;
  },
  mock: mockOptions,
};
