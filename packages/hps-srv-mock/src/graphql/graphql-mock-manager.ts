import { logger } from '@hyperse/hps-srv-common';
import { parseOperation } from '../helpers/parse-gql-operation.js';
import type { GraphqlMockMapItem } from '../types/types-graphql.js';
import type {
  HpsMockApplicationOptions,
  HpsMockOptions,
} from '../types/types-options.js';
import { GraphqlEndpointManager } from './graphql-endpoint-manager.js';

type GraphqlMockManagerMap = {
  endpointManagers: GraphqlEndpointManager[];
  graphqlMockMapItem: GraphqlMockMapItem;
};

export class GraphqlMockManager {
  private mockOptions: HpsMockOptions;
  private graphqlMockManagerMap: Map<string, GraphqlMockManagerMap> = new Map();
  private allEndpointManagers: GraphqlEndpointManager[] = [];

  public async setup(
    mockOptions: HpsMockOptions,
    applicationOptions: HpsMockApplicationOptions
  ) {
    this.mockOptions = mockOptions;
    this.initializeEndpointManagers(applicationOptions);
    if (this.allEndpointManagers.length) {
      for (const endpointManager of this.allEndpointManagers) {
        await endpointManager.downloadIntrospectionSchema();
      }
    }
  }

  private initializeEndpointManagers(
    applicationOptions: HpsMockApplicationOptions
  ): void {
    const { graphqlMockMap = {} } = this.mockOptions;
    for (const [serviceName, graphqlMockMapItem] of Object.entries(
      graphqlMockMap
    )) {
      const sortedEndpoints = graphqlMockMapItem.endpoints.sort(
        (a, b) => (a.priority || 0) - (b.priority || 0)
      );
      const endpointManagers = sortedEndpoints.map(
        (endpoint) =>
          new GraphqlEndpointManager(
            this.mockOptions,
            serviceName,
            endpoint,
            applicationOptions
          )
      );
      this.allEndpointManagers.push(...endpointManagers);
      this.graphqlMockManagerMap.set(serviceName, {
        endpointManagers,
        graphqlMockMapItem,
      });
    }
  }

  public getGraphqlMockManagerItem(
    serviceName: string
  ): GraphqlMockManagerMap | undefined {
    return this.graphqlMockManagerMap.get(serviceName);
  }

  public getEndpointManagers(serviceName: string): GraphqlEndpointManager[] {
    return this.graphqlMockManagerMap.get(serviceName)?.endpointManagers || [];
  }

  public getEndpointManager(
    serviceName: string,
    endpointName?: string
  ): GraphqlEndpointManager | undefined {
    return this.graphqlMockManagerMap
      .get(serviceName)
      ?.endpointManagers.find(
        (endpointManager) => endpointManager.endpoint.name === endpointName
      );
  }

  public async findSupportingEndpoint(
    serviceName: string,
    query: string
  ): Promise<GraphqlEndpointManager | undefined> {
    const operation = parseOperation(query);
    if (!operation) {
      return;
    }
    const endpointManagers = this.getEndpointManagers(serviceName);
    // 按优先级顺序检查每个端点
    for (const endpointManager of endpointManagers) {
      const isSupported = await endpointManager.validateOperation(operation);

      if (isSupported) {
        logger.debug(
          `Operation ${operation.operationName || 'anonymous'} supported by ${endpointManager.endpoint.name}`
        );
        return endpointManager;
      }
    }
    logger.debug(
      `No endpoint supports operation: ${operation.operationName || 'anonymous'}`
    );
    return;
  }
}

export const graphqlMockManager = new GraphqlMockManager();
