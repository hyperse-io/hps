@hyperse/hps-graphqlsp

## 0.0.2-next.13

### Patch Changes

- [#40](https://github.com/hyperse-io/hps/pull/40) [`127ea64`](https://github.com/hyperse-io/hps/commit/127ea644045174924a1a9d68fdd934166ca21735) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - refactor: remove hps-plugin-load-config package and update related dependencies; enhance type definitions across multiple packages

## 0.0.2-next.12

### Patch Changes

- [#39](https://github.com/hyperse-io/hps/pull/39) [`6565548`](https://github.com/hyperse-io/hps/commit/6565548923570188524ae1edbf21dd1ff0d67142) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - chore: update package dependencies across multiple packages; enhance type definitions and add new flags for serve plugin

## 0.0.2-next.11

### Patch Changes

- [#36](https://github.com/hyperse-io/hps/pull/36) [`3cf6a34`](https://github.com/hyperse-io/hps/commit/3cf6a346f17b8a0244bd2e3939fe86795244e9b6) Thanks [@tclxshunquan-wang](https://github.com/tclxshunquan-wang)! - feat: add formatEndpointName helper function to format GraphQL endpoint names

  refactor: update attachGraphqlMockItem to use new endpoint name format

  refactor: integrate formatEndpointName in standard-graphql-endpoint middleware

  refactor: modify standard-graphql middleware to utilize new endpoint name structure

  refactor: enhance types for GraphqlMockEndpoint and GraphqlMockMapItem

  fix: update HpsMockOptions to accept generic GraphqlMockMap

  chore: add TypeScript definitions for admin-plugin, metrics-plugin, and dev-server

  chore: create index file for GraphQL mock operations mapping
