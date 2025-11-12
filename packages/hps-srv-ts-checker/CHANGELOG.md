@hyperse/hps-srv-ts-checker

## 0.0.2-next.11

### Patch Changes

- [#48](https://github.com/hyperse-io/hps/pull/48) [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: remove the manually injected reactRefreshRuntime and reactRefreshSetup in rspack.
  chore: bump versions of swc_core
  chore: bump versions of code_inspector
- Updated dependencies [[`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3)]:
  - @hyperse/hps-srv-common@0.0.2-next.12

## 0.0.2-next.10

### Patch Changes

- [#46](https://github.com/hyperse-io/hps/pull/46) [`4fc2ccc`](https://github.com/hyperse-io/hps/commit/4fc2ccc357a492ff76acdc8efd02ee84ce1d2995) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - fix: ensure compiler cleanup on process exit in TypeScript checker

## 0.0.2-next.9

### Patch Changes

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

- Updated dependencies [[`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735)]:
  - @hyperse/hps-srv-common@0.0.2-next.11

## 0.0.2-next.8

### Patch Changes

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

- Updated dependencies [[`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142)]:
  - @hyperse/hps-srv-common@0.0.2-next.10

## 0.0.2-next.7

### Patch Changes

- [#31](https://github.com/hyperse-io/hps/pull/31) [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: clean up tsconfig.json by removing unused plugin configuration and retaining incremental build option

- Updated dependencies [[`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d)]:
  - @hyperse/hps-srv-common@0.0.2-next.9

## 0.0.2-next.6

### Patch Changes

- [#28](https://github.com/hyperse-io/hps/pull/28) [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add hps-plugin-ts-graphqlsp package with TypeScript support, GraphQL introspection, and code generation capabilities

- Updated dependencies [[`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585)]:
  - @hyperse/hps-srv-common@0.0.2-next.8

## 0.0.2-next.5

### Patch Changes

- [#24](https://github.com/hyperse-io/hps/pull/24) [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: implement GraphQL mocking capabilities with schema generation, introspection downloading, and middleware integration

- Updated dependencies [[`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24)]:
  - @hyperse/hps-srv-common@0.0.2-next.7

## 0.0.2-next.4

### Patch Changes

- [#22](https://github.com/hyperse-io/hps/pull/22) [`6dce79e`](https://github.com/hyperse-io/hps/commit/6dce79eff1d14913194ac39f13d3039559144f39) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - ## 🚀 New Features
  - **Rspack Plugin Configuration Refactor**: Unify htmlPlugin settings and enhance output options for better build optimization
  - **Enhanced MultiHtmlPlugin Integration**: Streamlined rspack configuration with improved loader and plugin options
  - **TypeScript Checker Integration**: Add hps-srv-ts-checker package with integrated TypeScript checker functionality
  - **Dynamic UI Enhancements**: Enhanced main module layout and styling with improved header, list items, and dynamic datetime display

  ## 🔧 Performance Improvements
  - **Improved Chunk File Handling**: Better build optimization and chunk management
  - **Enhanced Circular Dependency Detection**: Improved regex patterns in cutBefore function for better performance
  - **Streamlined Configuration Merging**: Optimized inspector evolve config processing

  ## 🐞 Bug Fixes
  - **Environment Variable Handling**: Update public environment variable keys to include process.env prefix
  - **Browser Opening Functionality**: Replace 'open' with 'better-opn' for improved tab handling
  - **Library Output Handling**: Skip entries with defined output library in mergeInspectorEvolveConfig

  ## 📖 Documentation Updates
  - **Enhanced README Files**: Update HPS and plugin documentation with enhanced features, installation instructions, and usage examples
  - **Improved Developer Experience**: Better documentation across the ecosystem

  ## 🔨 Refactoring
  - **Configuration Handling**: Update dependencies and refactor configuration handling in hps package
  - **Code Organization**: Improved import management and code structure across packages

- Updated dependencies [[`6dce79e`](https://github.com/hyperse-io/hps/commit/6dce79eff1d14913194ac39f13d3039559144f39)]:
  - @hyperse/hps-srv-common@0.0.2-next.6

## 0.0.2-next.3

### Patch Changes

- [#20](https://github.com/hyperse-io/hps/pull/20) [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package versions and enhance circular dependency detection in rspack

- Updated dependencies [[`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450)]:
  - @hyperse/hps-srv-common@0.0.2-next.5
