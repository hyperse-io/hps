# @hyperse/hps-plugin-update

## 0.0.2-next.17

### Patch Changes

- [#48](https://github.com/hyperse-io/hps/pull/48) [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: remove the manually injected reactRefreshRuntime and reactRefreshSetup in rspack.
  chore: bump versions of swc_core
  chore: bump versions of code_inspector

## 0.0.2-next.16

### Patch Changes

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

## 0.0.2-next.15

### Patch Changes

- [`dc98408`](https://github.com/hyperse-io/hps/commit/dc9840828bbd2300dfaf9fd4f2cc91f226d8c947) Thanks [@tianyingchun](https://github.com/tianyingchun)! - add 'deep' flag to update plugin for recursive updates and update related messages

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

## 0.0.2-next.14

### Patch Changes

- [#31](https://github.com/hyperse-io/hps/pull/31) [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: clean up tsconfig.json by removing unused plugin configuration and retaining incremental build option

## 0.0.2-next.13

### Patch Changes

- [`0cb6407`](https://github.com/hyperse-io/hps/commit/0cb640770d6627d73848844b7aa80617801698a3) Thanks [@tianyingchun](https://github.com/tianyingchun)! - remove projectCwd flag, improved `hps update`

## 0.0.2-next.12

### Patch Changes

- [#28](https://github.com/hyperse-io/hps/pull/28) [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add hps-plugin-ts-graphqlsp package with TypeScript support, GraphQL introspection, and code generation capabilities

## 0.0.2-next.11

### Patch Changes

- [#24](https://github.com/hyperse-io/hps/pull/24) [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: implement GraphQL mocking capabilities with schema generation, introspection downloading, and middleware integration

## 0.0.2-next.10

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

## 0.0.2-next.9

### Patch Changes

- [#20](https://github.com/hyperse-io/hps/pull/20) [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package versions and enhance circular dependency detection in rspack

## 0.0.2-next.8

### Patch Changes

- [#18](https://github.com/hyperse-io/hps/pull/18) [`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: update imports in index.ts and remove hps-srv-testing package files

## 0.0.2-next.7

### Patch Changes

- [#16](https://github.com/hyperse-io/hps/pull/16) [`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-srv-testing package and update related imports across multiple packages

## 0.0.2-next.6

### Patch Changes

- [#14](https://github.com/hyperse-io/hps/pull/14) [`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - fix hps-srv-rspack-plugin-postcss import

## 0.0.2-next.5

### Patch Changes

- [#11](https://github.com/hyperse-io/hps/pull/11) [`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: perfect hps cli

## 0.0.2-next.4

### Patch Changes

- [`c6d645c`](https://github.com/hyperse-io/hps/commit/c6d645c2eb810204e0894b7954e56b7eb6b0ea79) Thanks [@tianyingchun](https://github.com/tianyingchun)! - update @hyperse/wizard and related plugins to version

## 0.0.2-next.3

### Patch Changes

- [`6259317`](https://github.com/hyperse-io/hps/commit/6259317b8ce718d1d7a608a9bdaa7f105723d39e) Thanks [@tianyingchun](https://github.com/tianyingchun)! - bump wizard

## 0.0.2-next.2

### Patch Changes

- [`869a57c`](https://github.com/hyperse-io/hps/commit/869a57c65e81a7f21ab2996fadf168c606747957) Thanks [@tianyingchun](https://github.com/tianyingchun)! - update @hyperse/wizard and related plugins to version 1.0.2; set locale in hps package

## 0.0.2-next.1

### Patch Changes

- [`8562785`](https://github.com/hyperse-io/hps/commit/856278589bf5a2377d384e1ff50bf4fa174883a7) Thanks [@tianyingchun](https://github.com/tianyingchun)! - integrate hps-plugin-deploy and hps-plugin-update into hps package

## 0.0.2-next.0

### Patch Changes

- [`63dd8be`](https://github.com/hyperse-io/hps/commit/63dd8be1b4d2f2ad3489db920a91731c8f09f53e) Thanks [@tianyingchun](https://github.com/tianyingchun)! - add hps-plugin-update package for managing workspace package updates
