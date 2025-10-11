---
"@hyperse/hps-srv-rspack": patch
"@hyperse/hps-graphqlsp": patch
"@hyperse/hps-srv-mock": patch
---

feat: add formatEndpointName helper function to format GraphQL endpoint names

refactor: update attachGraphqlMockItem to use new endpoint name format

refactor: integrate formatEndpointName in standard-graphql-endpoint middleware

refactor: modify standard-graphql middleware to utilize new endpoint name structure

refactor: enhance types for GraphqlMockEndpoint and GraphqlMockMapItem

fix: update HpsMockOptions to accept generic GraphqlMockMap

chore: add TypeScript definitions for admin-plugin, metrics-plugin, and dev-server

chore: create index file for GraphQL mock operations mapping