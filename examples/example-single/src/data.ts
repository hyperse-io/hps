import type { MainTemplateData } from './Dashboard';

export const mockDashboardData: MainTemplateData = {
  title: 'hps serve evolve',
  modules: [
    {
      name: 'main',
      link: 'http://dev.hps.com:40000/route/main',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'home',
      link: 'http://dev.hps.com:40000/route/home',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'hmr',
      link: 'http://dev.hps.com:40000/route/hmr',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'hmrlframe',
      link: 'http://dev.hps.com:40000/route/hmrlframe',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'hmrLibrary',
      link: 'http://dev.hps.com:40000/route/hmrLibrary',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'dynamicImport',
      link: 'http://dev.hps.com:40000/route/dynamicImport',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'Runtime Manifest',
      link: 'http://dev.hps.com:40000/route/runtime/manifest.json',
      flagText: 'serve',
      isServed: 1,
    },
    {
      name: 'login',
      link: 'http://dev.hps.com:40000/route/login',
      flagText: 'static',
      isServed: 0,
    },
    {
      name: '403',
      link: 'http://dev.hps.com:40000/route/403',
      flagText: 'static',
      isServed: 0,
    },
  ],
};
