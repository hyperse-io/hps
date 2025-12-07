# @hyperse/hps-plugin-serve

## 0.1.0

### Minor Changes

- [#55](https://github.com/hyperse-io/hps/pull/55) [`c193821`](https://github.com/hyperse-io/hps/commit/c193821ffde8f7520ec55de5f1d2536ca0c35658) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add mode configuration for evolve build command and enhance CLI tests

- [#57](https://github.com/hyperse-io/hps/pull/57) [`f64a7c7`](https://github.com/hyperse-io/hps/commit/f64a7c7a3a56702a3f8ddc17d4bed3e65a26023b) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - Release the official version

### Patch Changes

- [#20](https://github.com/hyperse-io/hps/pull/20) [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package versions and enhance circular dependency detection in rspack

- [#24](https://github.com/hyperse-io/hps/pull/24) [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: implement GraphQL mocking capabilities with schema generation, introspection downloading, and middleware integration

- [#16](https://github.com/hyperse-io/hps/pull/16) [`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-srv-testing package and update related imports across multiple packages

- [#14](https://github.com/hyperse-io/hps/pull/14) [`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - fix hps-srv-rspack-plugin-postcss import

- [#11](https://github.com/hyperse-io/hps/pull/11) [`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: perfect hps cli

- [#18](https://github.com/hyperse-io/hps/pull/18) [`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: update imports in index.ts and remove hps-srv-testing package files

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

- [#28](https://github.com/hyperse-io/hps/pull/28) [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add hps-plugin-ts-graphqlsp package with TypeScript support, GraphQL introspection, and code generation capabilities

- [`6259317`](https://github.com/hyperse-io/hps/commit/6259317b8ce718d1d7a608a9bdaa7f105723d39e) Thanks [@tianyingchun](https://github.com/tianyingchun)! - bump wizard

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

- [#31](https://github.com/hyperse-io/hps/pull/31) [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: clean up tsconfig.json by removing unused plugin configuration and retaining incremental build option

- [#48](https://github.com/hyperse-io/hps/pull/48) [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: remove the manually injected reactRefreshRuntime and reactRefreshSetup in rspack.
  chore: bump versions of swc_core
  chore: bump versions of code_inspector

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

- Updated dependencies [[`9787afb`](https://github.com/hyperse-io/hps/commit/9787afba77165355c0770839e210a3d41e86a8be), [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450), [`c193821`](https://github.com/hyperse-io/hps/commit/c193821ffde8f7520ec55de5f1d2536ca0c35658), [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24), [`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67), [`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d), [`3cf6a34`](https://github.com/hyperse-io/hps/commit/3cf6a346f17b8a0244bd2e3939fe86795244e9b6), [`f24517f`](https://github.com/hyperse-io/hps/commit/f24517fa68f362c98e9f429e7c1e267f6dfa47c1), [`837c76a`](https://github.com/hyperse-io/hps/commit/837c76a17d1ae01cba2279b58e91a1652b8da8c1), [`9d25efd`](https://github.com/hyperse-io/hps/commit/9d25efd21828ffbb75d3be9add9afec68659faee), [`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40), [`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7), [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142), [`97a5e3c`](https://github.com/hyperse-io/hps/commit/97a5e3c2f702804c11828ce37d904c1118f9f359), [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585), [`6259317`](https://github.com/hyperse-io/hps/commit/6259317b8ce718d1d7a608a9bdaa7f105723d39e), [`6dce79e`](https://github.com/hyperse-io/hps/commit/6dce79eff1d14913194ac39f13d3039559144f39), [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d), [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3), [`c3fce5c`](https://github.com/hyperse-io/hps/commit/c3fce5c36e98b9bf69f2f8f63bf764dd4ea20439), [`b004a21`](https://github.com/hyperse-io/hps/commit/b004a21cf05118e0023a0701edbf1741fcbcfde0), [`f64a7c7`](https://github.com/hyperse-io/hps/commit/f64a7c7a3a56702a3f8ddc17d4bed3e65a26023b), [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735)]:
  - @hyperse/hps-srv-rspack@0.1.0
  - @hyperse/hps-srv-common@0.1.0
  - @hyperse/hps-srv-mock@0.1.0

## 0.0.2-next.19

### Patch Changes

- Updated dependencies [[`c3fce5c`](https://github.com/hyperse-io/hps/commit/c3fce5c36e98b9bf69f2f8f63bf764dd4ea20439)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.19

## 0.0.2-next.18

### Patch Changes

- Updated dependencies [[`97a5e3c`](https://github.com/hyperse-io/hps/commit/97a5e3c2f702804c11828ce37d904c1118f9f359)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.18

## 0.0.2-next.17

### Patch Changes

- [#48](https://github.com/hyperse-io/hps/pull/48) [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: remove the manually injected reactRefreshRuntime and reactRefreshSetup in rspack.
  chore: bump versions of swc_core
  chore: bump versions of code_inspector
- Updated dependencies [[`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3)]:
  - @hyperse/hps-srv-common@0.0.2-next.12
  - @hyperse/hps-srv-rspack@0.0.2-next.17
  - @hyperse/hps-srv-mock@0.0.2-next.15

## 0.0.2-next.16

### Patch Changes

- Updated dependencies [[`f24517f`](https://github.com/hyperse-io/hps/commit/f24517fa68f362c98e9f429e7c1e267f6dfa47c1)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.16

## 0.0.2-next.15

### Patch Changes

- Updated dependencies [[`9787afb`](https://github.com/hyperse-io/hps/commit/9787afba77165355c0770839e210a3d41e86a8be)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.15

## 0.0.2-next.14

### Patch Changes

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

- Updated dependencies [[`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735)]:
  - @hyperse/hps-srv-common@0.0.2-next.11
  - @hyperse/hps-srv-rspack@0.0.2-next.14
  - @hyperse/hps-srv-mock@0.0.2-next.14

## 0.0.2-next.13

### Patch Changes

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

- Updated dependencies [[`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142)]:
  - @hyperse/hps-srv-common@0.0.2-next.10
  - @hyperse/hps-srv-rspack@0.0.2-next.13
  - @hyperse/hps-srv-mock@0.0.2-next.13

## 0.0.2-next.12

### Patch Changes

- Updated dependencies [[`3cf6a34`](https://github.com/hyperse-io/hps/commit/3cf6a346f17b8a0244bd2e3939fe86795244e9b6)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.12
  - @hyperse/hps-srv-mock@0.0.2-next.12

## 0.0.2-next.11

### Patch Changes

- Updated dependencies [[`837c76a`](https://github.com/hyperse-io/hps/commit/837c76a17d1ae01cba2279b58e91a1652b8da8c1), [`b004a21`](https://github.com/hyperse-io/hps/commit/b004a21cf05118e0023a0701edbf1741fcbcfde0)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.11
  - @hyperse/hps-srv-mock@0.0.2-next.11

## 0.0.2-next.10

### Patch Changes

- [#31](https://github.com/hyperse-io/hps/pull/31) [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: clean up tsconfig.json by removing unused plugin configuration and retaining incremental build option

- Updated dependencies [[`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d)]:
  - @hyperse/hps-srv-common@0.0.2-next.9
  - @hyperse/hps-srv-rspack@0.0.2-next.10
  - @hyperse/hps-srv-mock@0.0.2-next.10

## 0.0.2-next.9

### Patch Changes

- [#28](https://github.com/hyperse-io/hps/pull/28) [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add hps-plugin-ts-graphqlsp package with TypeScript support, GraphQL introspection, and code generation capabilities

- Updated dependencies [[`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585)]:
  - @hyperse/hps-srv-common@0.0.2-next.8
  - @hyperse/hps-srv-rspack@0.0.2-next.9
  - @hyperse/hps-srv-mock@0.0.2-next.9

## 0.0.2-next.8

### Patch Changes

- Updated dependencies [[`9d25efd`](https://github.com/hyperse-io/hps/commit/9d25efd21828ffbb75d3be9add9afec68659faee)]:
  - @hyperse/hps-srv-rspack@0.0.2-next.8
  - @hyperse/hps-srv-mock@0.0.2-next.8

## 0.0.2-next.7

### Patch Changes

- [#24](https://github.com/hyperse-io/hps/pull/24) [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: implement GraphQL mocking capabilities with schema generation, introspection downloading, and middleware integration

- Updated dependencies [[`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24)]:
  - @hyperse/hps-srv-common@0.0.2-next.7
  - @hyperse/hps-srv-rspack@0.0.2-next.7
  - @hyperse/hps-srv-mock@0.0.2-next.7

## 0.0.2-next.6

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
  - @hyperse/hps-srv-rspack@0.0.2-next.6
  - @hyperse/hps-srv-mock@0.0.2-next.6

## 0.0.2-next.5

### Patch Changes

- [#20](https://github.com/hyperse-io/hps/pull/20) [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package versions and enhance circular dependency detection in rspack

- Updated dependencies [[`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450)]:
  - @hyperse/hps-srv-common@0.0.2-next.5
  - @hyperse/hps-srv-rspack@0.0.2-next.5
  - @hyperse/hps-srv-mock@0.0.2-next.5

## 0.0.2-next.4

### Patch Changes

- [#18](https://github.com/hyperse-io/hps/pull/18) [`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: update imports in index.ts and remove hps-srv-testing package files

- Updated dependencies [[`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7)]:
  - @hyperse/hps-srv-common@0.0.2-next.4
  - @hyperse/hps-srv-rspack@0.0.2-next.4
  - @hyperse/hps-srv-mock@0.0.2-next.4

## 0.0.2-next.3

### Patch Changes

- [#16](https://github.com/hyperse-io/hps/pull/16) [`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-srv-testing package and update related imports across multiple packages

- Updated dependencies [[`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67)]:
  - @hyperse/hps-srv-common@0.0.2-next.3
  - @hyperse/hps-srv-rspack@0.0.2-next.3
  - @hyperse/hps-srv-mock@0.0.2-next.3

## 0.0.2-next.2

### Patch Changes

- [#14](https://github.com/hyperse-io/hps/pull/14) [`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - fix hps-srv-rspack-plugin-postcss import

- Updated dependencies [[`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d)]:
  - @hyperse/hps-srv-common@0.0.2-next.2
  - @hyperse/hps-srv-rspack@0.0.2-next.2
  - @hyperse/hps-srv-mock@0.0.2-next.2

## 0.0.2-next.1

### Patch Changes

- [#11](https://github.com/hyperse-io/hps/pull/11) [`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: perfect hps cli

- Updated dependencies [[`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40)]:
  - @hyperse/hps-srv-common@0.0.2-next.1
  - @hyperse/hps-srv-rspack@0.0.2-next.1
  - @hyperse/hps-srv-mock@0.0.2-next.1
