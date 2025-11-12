# @hyperse/hps

## 0.1.0-next.27

### Patch Changes

- [#48](https://github.com/hyperse-io/hps/pull/48) [`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: remove the manually injected reactRefreshRuntime and reactRefreshSetup in rspack.
  chore: bump versions of swc_core
  chore: bump versions of code_inspector
- Updated dependencies [[`fee8db6`](https://github.com/hyperse-io/hps/commit/fee8db6d791a8999688082d7c5008c2bb78f29f3)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.17
  - @hyperse/hps-plugin-update@0.0.2-next.17
  - @hyperse/hps-plugin-build@0.0.2-next.17
  - @hyperse/hps-plugin-serve@0.0.2-next.17
  - @hyperse/hps-plugin-info@0.1.0-next.18
  - @hyperse/hps-plugin-mock@0.0.2-next.15
  - @hyperse/hps-srv-common@0.0.2-next.12

## 0.1.0-next.26

### Patch Changes

- Updated dependencies []:
  - @hyperse/hps-plugin-build@0.0.2-next.16
  - @hyperse/hps-plugin-serve@0.0.2-next.16

## 0.1.0-next.25

### Patch Changes

- [#44](https://github.com/hyperse-io/hps/pull/44) [`baca892`](https://github.com/hyperse-io/hps/commit/baca8921a65594c1f5ad6fe77678111846051b6e) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add @hyperse/wizard-plugin-completion to hps; integrate completion plugin into CLI and test setup

## 0.1.0-next.24

### Patch Changes

- [#43](https://github.com/hyperse-io/hps/pull/43) [`9787afb`](https://github.com/hyperse-io/hps/commit/9787afba77165355c0770839e210a3d41e86a8be) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: add @swc/helpers and @swc/core dependencies in hps-srv-rspack; replace static version resolution with dynamic cliPackage?.version in hps

- [`00f9f13`](https://github.com/hyperse-io/hps/commit/00f9f13db4f9091c0eae0b5fa6e85de8e42600b4) Thanks [@tianyingchun](https://github.com/tianyingchun)! - enable compile cache and update version retrieval in hps CLI

- Updated dependencies []:
  - @hyperse/hps-plugin-build@0.0.2-next.15
  - @hyperse/hps-plugin-serve@0.0.2-next.15

## 0.1.0-next.23

### Patch Changes

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

- Updated dependencies [[`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.16
  - @hyperse/hps-plugin-update@0.0.2-next.16
  - @hyperse/hps-plugin-build@0.0.2-next.14
  - @hyperse/hps-plugin-serve@0.0.2-next.14
  - @hyperse/hps-plugin-info@0.1.0-next.17
  - @hyperse/hps-plugin-mock@0.0.2-next.14
  - @hyperse/hps-srv-common@0.0.2-next.11

## 0.1.0-next.22

### Patch Changes

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

- Updated dependencies [[`dc98408`](https://github.com/hyperse-io/hps/commit/dc9840828bbd2300dfaf9fd4f2cc91f226d8c947), [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142)]:
  - @hyperse/hps-plugin-update@0.0.2-next.15
  - @hyperse/hps-plugin-load-config@0.1.0-next.16
  - @hyperse/hps-plugin-deploy@0.0.2-next.15
  - @hyperse/hps-plugin-build@0.0.2-next.13
  - @hyperse/hps-plugin-serve@0.0.2-next.13
  - @hyperse/hps-plugin-info@0.1.0-next.16
  - @hyperse/hps-plugin-mock@0.0.2-next.13
  - @hyperse/hps-srv-common@0.0.2-next.10

## 0.1.0-next.21

### Patch Changes

- Updated dependencies []:
  - @hyperse/hps-plugin-build@0.0.2-next.12
  - @hyperse/hps-plugin-serve@0.0.2-next.12
  - @hyperse/hps-plugin-mock@0.0.2-next.12

## 0.1.0-next.20

### Patch Changes

- Updated dependencies []:
  - @hyperse/hps-plugin-build@0.0.2-next.11
  - @hyperse/hps-plugin-serve@0.0.2-next.11
  - @hyperse/hps-plugin-mock@0.0.2-next.11

## 0.1.0-next.19

### Patch Changes

- [#31](https://github.com/hyperse-io/hps/pull/31) [`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: clean up tsconfig.json by removing unused plugin configuration and retaining incremental build option

- Updated dependencies [[`b5cd647`](https://github.com/hyperse-io/hps/commit/b5cd6471f97177edd47bbb9fcc525c69883b9b8d)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.15
  - @hyperse/hps-plugin-deploy@0.0.2-next.14
  - @hyperse/hps-plugin-update@0.0.2-next.14
  - @hyperse/hps-plugin-build@0.0.2-next.10
  - @hyperse/hps-plugin-serve@0.0.2-next.10
  - @hyperse/hps-plugin-info@0.1.0-next.15
  - @hyperse/hps-plugin-mock@0.0.2-next.10
  - @hyperse/hps-srv-common@0.0.2-next.9

## 0.1.0-next.18

### Patch Changes

- Updated dependencies [[`0cb6407`](https://github.com/hyperse-io/hps/commit/0cb640770d6627d73848844b7aa80617801698a3)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.13
  - @hyperse/hps-plugin-update@0.0.2-next.13

## 0.1.0-next.17

### Patch Changes

- [#28](https://github.com/hyperse-io/hps/pull/28) [`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add hps-plugin-ts-graphqlsp package with TypeScript support, GraphQL introspection, and code generation capabilities

- Updated dependencies [[`0328b89`](https://github.com/hyperse-io/hps/commit/0328b899cb47aaf51908d7e4ceb83d660088c585)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.14
  - @hyperse/hps-plugin-deploy@0.0.2-next.12
  - @hyperse/hps-plugin-update@0.0.2-next.12
  - @hyperse/hps-plugin-build@0.0.2-next.9
  - @hyperse/hps-plugin-serve@0.0.2-next.9
  - @hyperse/hps-plugin-info@0.1.0-next.14
  - @hyperse/hps-plugin-mock@0.0.2-next.9
  - @hyperse/hps-srv-common@0.0.2-next.8

## 0.1.0-next.16

### Patch Changes

- Updated dependencies []:
  - @hyperse/hps-plugin-build@0.0.2-next.8
  - @hyperse/hps-plugin-serve@0.0.2-next.8
  - @hyperse/hps-plugin-mock@0.0.2-next.8

## 0.1.0-next.15

### Patch Changes

- [#24](https://github.com/hyperse-io/hps/pull/24) [`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: implement GraphQL mocking capabilities with schema generation, introspection downloading, and middleware integration

- Updated dependencies [[`0a19922`](https://github.com/hyperse-io/hps/commit/0a199222465e3cefc9fc9450e9117a234e7f8b24)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.13
  - @hyperse/hps-plugin-deploy@0.0.2-next.11
  - @hyperse/hps-plugin-update@0.0.2-next.11
  - @hyperse/hps-plugin-build@0.0.2-next.7
  - @hyperse/hps-plugin-serve@0.0.2-next.7
  - @hyperse/hps-plugin-info@0.1.0-next.13
  - @hyperse/hps-plugin-mock@0.0.2-next.7
  - @hyperse/hps-srv-common@0.0.2-next.7

## 0.1.0-next.14

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
  - @hyperse/hps-plugin-load-config@0.1.0-next.12
  - @hyperse/hps-plugin-deploy@0.0.2-next.10
  - @hyperse/hps-plugin-update@0.0.2-next.10
  - @hyperse/hps-plugin-build@0.0.2-next.6
  - @hyperse/hps-plugin-serve@0.0.2-next.6
  - @hyperse/hps-plugin-info@0.1.0-next.12
  - @hyperse/hps-plugin-mock@0.0.2-next.6
  - @hyperse/hps-srv-common@0.0.2-next.6

## 0.1.0-next.13

### Patch Changes

- [#20](https://github.com/hyperse-io/hps/pull/20) [`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package versions and enhance circular dependency detection in rspack

- Updated dependencies [[`6a9cae8`](https://github.com/hyperse-io/hps/commit/6a9cae817150b0d2f123da6dcf04f8b310935450)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.11
  - @hyperse/hps-plugin-deploy@0.0.2-next.9
  - @hyperse/hps-plugin-update@0.0.2-next.9
  - @hyperse/hps-plugin-build@0.0.2-next.5
  - @hyperse/hps-plugin-serve@0.0.2-next.5
  - @hyperse/hps-plugin-info@0.1.0-next.11
  - @hyperse/hps-plugin-mock@0.0.2-next.5
  - @hyperse/hps-srv-common@0.0.2-next.5

## 0.1.0-next.12

### Patch Changes

- [#18](https://github.com/hyperse-io/hps/pull/18) [`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: update imports in index.ts and remove hps-srv-testing package files

- Updated dependencies [[`0c62d0e`](https://github.com/hyperse-io/hps/commit/0c62d0ebe7bf8f860e9863556121a20c478788f7)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.10
  - @hyperse/hps-plugin-deploy@0.0.2-next.8
  - @hyperse/hps-plugin-update@0.0.2-next.8
  - @hyperse/hps-plugin-build@0.0.2-next.4
  - @hyperse/hps-plugin-serve@0.0.2-next.4
  - @hyperse/hps-plugin-info@0.1.0-next.10
  - @hyperse/hps-plugin-mock@0.0.2-next.4
  - @hyperse/hps-srv-common@0.0.2-next.4

## 0.1.0-next.11

### Patch Changes

- [#16](https://github.com/hyperse-io/hps/pull/16) [`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-srv-testing package and update related imports across multiple packages

- Updated dependencies [[`ef4a455`](https://github.com/hyperse-io/hps/commit/ef4a455099c954727da0f6aebcc8e495ef41fc67)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.9
  - @hyperse/hps-plugin-deploy@0.0.2-next.7
  - @hyperse/hps-plugin-update@0.0.2-next.7
  - @hyperse/hps-plugin-build@0.0.2-next.3
  - @hyperse/hps-plugin-serve@0.0.2-next.3
  - @hyperse/hps-plugin-info@0.1.0-next.9
  - @hyperse/hps-plugin-mock@0.0.2-next.3
  - @hyperse/hps-srv-common@0.0.2-next.3

# <<<<<<< HEAD

## 0.1.0-next.10

### Patch Changes

- [#14](https://github.com/hyperse-io/hps/pull/14) [`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - fix hps-srv-rspack-plugin-postcss import

- Updated dependencies [[`e4e364e`](https://github.com/hyperse-io/hps/commit/e4e364e5b142da028a8cd81fee0bce019906017d)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.8
  - @hyperse/hps-plugin-deploy@0.0.2-next.6
  - @hyperse/hps-plugin-update@0.0.2-next.6
  - @hyperse/hps-plugin-build@0.0.2-next.2
  - @hyperse/hps-plugin-serve@0.0.2-next.2
  - @hyperse/hps-plugin-info@0.1.0-next.8
  - @hyperse/hps-plugin-mock@0.0.2-next.2

> > > > > > > upstream/main

## 0.1.0-next.9

### Patch Changes

- [#11](https://github.com/hyperse-io/hps/pull/11) [`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: perfect hps cli

- Updated dependencies [[`7ed8413`](https://github.com/hyperse-io/hps/commit/7ed8413bdd1197749e34df32b72b4c242be00a40)]:
  - @hyperse/hps-plugin-load-config@0.1.0-next.7
  - @hyperse/hps-plugin-deploy@0.0.2-next.5
  - @hyperse/hps-plugin-update@0.0.2-next.5
  - @hyperse/hps-plugin-build@0.0.2-next.1
  - @hyperse/hps-plugin-serve@0.0.2-next.1
  - @hyperse/hps-plugin-info@0.1.0-next.7
  - @hyperse/hps-plugin-mock@0.0.2-next.1

## 0.1.0-next.8

### Patch Changes

- [`c6d645c`](https://github.com/hyperse-io/hps/commit/c6d645c2eb810204e0894b7954e56b7eb6b0ea79) Thanks [@tianyingchun](https://github.com/tianyingchun)! - update @hyperse/wizard and related plugins to version

- Updated dependencies [[`52c12ff`](https://github.com/hyperse-io/hps/commit/52c12ff6e7529a06c16f4d9b1231f24fe7368570), [`c6d645c`](https://github.com/hyperse-io/hps/commit/c6d645c2eb810204e0894b7954e56b7eb6b0ea79)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.4
  - @hyperse/hps-plugin-update@0.0.2-next.4
  - @hyperse/hps-plugin-info@0.1.0-next.6

## 0.1.0-next.7

### Patch Changes

- Updated dependencies [[`00ee9d9`](https://github.com/hyperse-io/hps/commit/00ee9d99c3354bb7b8bf6c87dc901bbdf07c7183)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.3

## 0.1.0-next.6

### Patch Changes

- [`6259317`](https://github.com/hyperse-io/hps/commit/6259317b8ce718d1d7a608a9bdaa7f105723d39e) Thanks [@tianyingchun](https://github.com/tianyingchun)! - bump wizard

- Updated dependencies [[`6259317`](https://github.com/hyperse-io/hps/commit/6259317b8ce718d1d7a608a9bdaa7f105723d39e)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.2
  - @hyperse/hps-plugin-update@0.0.2-next.3
  - @hyperse/hps-plugin-info@0.1.0-next.5

## 0.1.0-next.5

### Patch Changes

- [`869a57c`](https://github.com/hyperse-io/hps/commit/869a57c65e81a7f21ab2996fadf168c606747957) Thanks [@tianyingchun](https://github.com/tianyingchun)! - update @hyperse/wizard and related plugins to version 1.0.2; set locale in hps package

- Updated dependencies [[`869a57c`](https://github.com/hyperse-io/hps/commit/869a57c65e81a7f21ab2996fadf168c606747957)]:
  - @hyperse/hps-plugin-deploy@0.0.2-next.1
  - @hyperse/hps-plugin-update@0.0.2-next.2
  - @hyperse/hps-plugin-info@0.1.0-next.4

## 0.1.0-next.4

### Patch Changes

- [`8562785`](https://github.com/hyperse-io/hps/commit/856278589bf5a2377d384e1ff50bf4fa174883a7) Thanks [@tianyingchun](https://github.com/tianyingchun)! - integrate hps-plugin-deploy and hps-plugin-update into hps package

- Updated dependencies [[`8562785`](https://github.com/hyperse-io/hps/commit/856278589bf5a2377d384e1ff50bf4fa174883a7)]:
  - @hyperse/hps-plugin-update@0.0.2-next.1

## 0.1.0-next.3

### Minor Changes

- [`691901b`](https://github.com/hyperse-io/hps/commit/691901bfe8961c38140b9474457a80528f700005) Thanks [@tianyingchun](https://github.com/tianyingchun)! - refactor hps packageJson

### Patch Changes

- Updated dependencies [[`691901b`](https://github.com/hyperse-io/hps/commit/691901bfe8961c38140b9474457a80528f700005)]:
  - @hyperse/hps-plugin-info@0.1.0-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies [[`04874ab`](https://github.com/hyperse-io/hps/commit/04874abd7bcb6b65b3f3d3503d9fc05832e5e1f0)]:
  - @hyperse/hps-plugin-info@0.1.0-next.2

## 0.1.0-next.1

### Patch Changes

- Updated dependencies [[`3e3393e`](https://github.com/hyperse-io/hps/commit/3e3393e92503de7a23f46a3c36aacae92d605472)]:
  - @hyperse/hps-plugin-info@0.1.0-next.1

## 0.1.0-next.0

### Minor Changes

- [`ef2b804`](https://github.com/hyperse-io/hps/commit/ef2b804162320468d495ba2c195849b68f5282ca) Thanks [@tianyingchun](https://github.com/tianyingchun)! - implement hps-plugin-info with CLI information features

### Patch Changes

- Updated dependencies [[`ef2b804`](https://github.com/hyperse-io/hps/commit/ef2b804162320468d495ba2c195849b68f5282ca)]:
  - @hyperse/hps-plugin-info@0.1.0-next.0
