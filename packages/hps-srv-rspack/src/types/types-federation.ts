import type { LibraryOptions } from '@rspack/core';

/**
 * Advanced configuration for modules that should be shared in the share scope.
 */
export interface SharedConfig {
  /**
   * Include the provided and fallback module directly instead behind an async request. This allows to use this shared module in initial load too. All possible shared modules need to be eager too.
   */
  eager?: boolean;

  /**
   * Provided module that should be provided to share scope. Also acts as fallback module if no shared module is found in share scope or version isn't valid. Defaults to the property name.
   */
  import?: string | false;

  /**
   * Package name to determine required version from description file. This is only needed when package name can't be automatically determined from request.
   */
  packageName?: string;

  /**
   * Version requirement from module in share scope.
   */
  requiredVersion?: string | false;

  /**
   * Module is looked up under this key from the share scope.
   */
  shareKey?: string;

  /**
   * Share scope name.
   */
  shareScope?: string;

  /**
   * Allow only a single version of the shared module in share scope (disabled by default).
   */
  singleton?: boolean;

  /**
   * Do not accept shared module if version is not valid (defaults to yes, if local fallback module is available and shared module is not a singleton, otherwise no, has no effect if there is no required version specified).
   */
  strictVersion?: boolean;

  /**
   * Version of the provided module. Will replace lower matching versions, but not higher.
   */
  version?: string | false;
}

export interface SharedObject {
  [index: string]: string | SharedConfig;
}

/**
 * Advanced configuration for modules that should be exposed by this container.
 */
export interface ExposesConfig {
  /**
   * Request to a module that should be exposed by this container.
   * @example `import: './src/home/widget.tsx'`
   */
  import: string | string[];

  /**
   * Custom chunk name for the exposed module.
   * Do not include `normalizedEntryName` e.g.(`flatjs/evolve/home`)
   * @example `exposed-micro-module-home-widget` => `flatjs/evolve/home/exposed-micro-module-home-widget`
   */
  name: string;
}

/**
 * Modules that should be exposed by this container. Property names are used as public paths.
 */
export interface ExposesObject {
  /**
   *  @example `'./Widget': { name, import }`
   */
  [index: string]: ExposesConfig;
}

export interface ModuleFederationRemote {
  /**
   * Normally it can be the entryPath like `${projectVirtualPath}/home`
   * it will formatted into `evolve_demo_home`
   * Note: We need to config `declare module 'evolve_demo_home/Widget` in `global.d.ts`;
   * @example `home`
   */
  name: string;
  /**
   * The remote app resouce endpoint base path with prefix of `projectVirtualPath`
   * Normally This is only required when an external project module as remote widget.
   */
  endpoint?: (entryName: string, normalizedEntryName: string) => string;
}

/**
 * Multiple separate builds should form a single application.
 * This is often known as Micro-Frontends, but is not limited to that.
 */
export type ModuleFederationOptions = {
  /**
   * Container locations and request scopes from which modules should be resolved and loaded at runtime. When provided, property name is used as request scope, otherwise request scope is automatically inferred from container location.
   * {`${projectVirtualPath}/home`,`${projectVirtualPath}/mine`}
   */
  remotes?: Array<ModuleFederationRemote>;

  /**
   * Options for library.
   */
  library?: LibraryOptions;

  /**
   * The external type of the remote containers.
   */
  remoteType?:
    | 'import'
    | 'var'
    | 'module'
    | 'assign'
    | 'this'
    | 'window'
    | 'self'
    | 'global'
    | 'commonjs'
    | 'commonjs2'
    | 'commonjs-module'
    | 'commonjs-static'
    | 'amd'
    | 'amd-require'
    | 'umd'
    | 'umd2'
    | 'jsonp'
    | 'system'
    | 'promise'
    | 'script'
    | 'node-commonjs';

  /**
   * Modules that should be exposed by this container. When provided, property name is used as public name, otherwise public name is automatically inferred from request.
   */
  exposes?: ExposesObject[] | ExposesObject;

  /**
   * The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.
   */
  runtime?: string | false;

  /**
   * Share scope name used for all shared modules (defaults to 'default').
   */
  shareScope?: string;

  /**
   * Modules that should be shared in the share scope. When provided, property names are used to match requested modules in this compilation.
   */
  shared?: (string | SharedObject)[] | SharedObject;
};
