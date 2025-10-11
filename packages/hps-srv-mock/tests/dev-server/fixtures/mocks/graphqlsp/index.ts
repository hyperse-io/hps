/* eslint-disable */
// @ts-nocheck

import type { AdminPluginOperations } from "./admin-plugin";
import type { MetricsPluginOperations } from "./metrics-plugin";
import type { DevServerOperations } from "./dev-server";

declare module "@hyperse/hps-srv-mock" {
  interface GraphqlMockMapping {
    "hps/admin-api": {
      endpoints: {
        "admin-api": {
          Query: AdminPluginOperations["types"]["Query"];
          Mutation: AdminPluginOperations["types"]["Mutation"];
          Subscription: AdminPluginOperations["types"]["Subscription"];
        };
        "metrics-api": {
          Query: MetricsPluginOperations["types"]["Query"];
          Mutation: MetricsPluginOperations["types"]["Mutation"];
          Subscription: MetricsPluginOperations["types"]["Subscription"];
        };
      };
    };
    "hps/shop-api": {
      endpoints: {
        "dev-serve": {
          Query: DevServerOperations["types"]["Query"];
          Mutation: DevServerOperations["types"]["Mutation"];
          Subscription: DevServerOperations["types"]["Subscription"];
        };
      };
    };
  }
}
