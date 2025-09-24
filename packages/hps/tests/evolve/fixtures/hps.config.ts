import { myDefineConfig } from '../../../src/define-config';


const mockOptions = {
  hostname: 'dev.hps.com',
  mockBaseDir: `./mocks`,
  port: 40000,
  chunkSize: 3,
  staticMap: {
    '/static': 'static',
  },
  mockMap: {
    /**
     * export-class, named class, default class.
     * 1. `/api/export-class/export-default-class`
     * 2. `/api/export-class/export-named-class`
     * 3. `/api/export-class/new-instance-export-named-class`
     */
    '/export-class': {
      type: 'REST',
      defs: ['export-class'],
      middlewares: {},
    },
    /**
     * export function,
     * 1. `/api/export-function/exportAction`
     * 2. `/api/export-function/getExportDefaultFn1`
     * 3. `/api/export-function/getExportDefaultFn2`
     */
    '/export-function': {
      type: 'REST',
      defs: ['export-function'],
      middlewares: {},
    },
    /**
     * module-exports
     * 1. `/api/module-exports/moduleExports`
     * 2. `/api/module-exports/exportsFunction`
     */
    '/module-exports': {
      type: 'REST',
      defs: ['module-exports'],
      middlewares: {},
    },
    /**
     * function-code
     * 1. `/api/function-code/moduleExports`
     * 2. `/api/function-code/exportsFunction`
     */
    '/function-code': {
      type: 'FUNC_SIMPLE',
      defs: ['function-code'],
      middlewares: {},
    },
    /**
     * others
     */
    '/*': { type: 'REST', defs: ['others'], middlewares: {} },
  },
}

const evolveOptions = {
  entryMap: {  
    home: {
      entry: ['./src/home/index.tsx'],
      options: {},
    },
    mine: {
      entry: ['./src/mine/index.tsx'],
      options: {},
    },
  },
  devServer: {
    port: 4000,
    pageProxy: '/route',
    defaultServeGlobalData: async () => {
      return {}
    },
    mockOptions: mockOptions,
  },
  rspack:{
    loader: {},
    externals:()=>{
      return {}
    },
    chunkFileVirtualPath: 'runtime-chunks',
    plugins: {
      htmlPlugin: {
        htmlCdn: 'http://dev.hps.com:4000/public',
      },
      tsCheckerPlugin: {
        enabled: false,
      },
      rsdoctorPlugin: {
        enabled: false,
      },
    },
  },
}

export default myDefineConfig(()=>{
  return {
    'build.evolve':()=>{
      return Promise.resolve(evolveOptions)
    },
    'serve.evolve':()=>{
      return Promise.resolve(evolveOptions)
    },
    'mock':mockOptions,
  }
})


