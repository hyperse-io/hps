import { OperationTypeNode } from 'graphql';
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

  /**
   * Initializes the GraphqlMockManager with the provided mock and application options.
   * Sets up all endpoint managers and downloads their introspection schemas.
   * @param mockOptions - The mock options configuration.
   * @param applicationOptions - The application options configuration.
   */
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

  /**
   * Initializes endpoint managers for each service and endpoint defined in the mock options.
   * Endpoint managers are sorted by priority.
   * @param applicationOptions - The application options configuration.
   */
  private initializeEndpointManagers(
    applicationOptions: HpsMockApplicationOptions
  ): void {
    const { graphqlMockMap = {} } = this.mockOptions;
    for (const [serviceName, graphqlMockMapItem] of Object.entries(
      graphqlMockMap
    )) {
      const allEndpoints = graphqlMockMapItem?.endpoints || {};
      const allEndpointKeys = Object.keys(allEndpoints);
      const sortedEndpointKeys = allEndpointKeys.sort((a, b) => {
        const previousEndpoint = allEndpoints[a];
        const nextEndpoint = allEndpoints[b];
        return (
          (previousEndpoint?.priority || 0) - (nextEndpoint?.priority || 0)
        );
      });
      const endpointManagers = sortedEndpointKeys.map((key) => {
        const currentEndpoint = allEndpoints[key];
        return new GraphqlEndpointManager(
          this.mockOptions,
          serviceName,
          key,
          currentEndpoint!,
          applicationOptions
        );
      });
      this.allEndpointManagers.push(...endpointManagers);
      this.graphqlMockManagerMap.set(serviceName, {
        endpointManagers,
        graphqlMockMapItem: graphqlMockMapItem!,
      });
    }
  }

  /**
   * Retrieves the GraphqlMockManagerMap for a given service name.
   * @param serviceName - The name of the service.
   * @returns The manager map for the service, or undefined if not found.
   */
  public getGraphqlMockManagerItem(
    serviceName: string
  ): GraphqlMockManagerMap | undefined {
    return this.graphqlMockManagerMap.get(serviceName);
  }

  /**
   * Retrieves all endpoint managers for a given service.
   * @param serviceName - The name of the service.
   * @returns An array of GraphqlEndpointManager instances.
   */
  public getEndpointManagers(serviceName: string): GraphqlEndpointManager[] {
    return this.graphqlMockManagerMap.get(serviceName)?.endpointManagers || [];
  }

  /**
   * Retrieves a specific endpoint manager by service and endpoint name.
   * @param serviceName - The name of the service.
   * @param endpointName - The name of the endpoint (optional).
   * @returns The matching GraphqlEndpointManager, or undefined if not found.
   */
  public getEndpointManager(
    serviceName: string,
    endpointName?: string
  ): GraphqlEndpointManager | undefined {
    return this.graphqlMockManagerMap
      .get(serviceName)
      ?.endpointManagers.find(
        (endpointManager) => endpointManager.name === endpointName
      );
  }

  /**
   * Finds the first endpoint manager that supports the given GraphQL operation.
   * Checks each endpoint in priority order.
   * @param serviceName - The name of the service.
   * @param query - The GraphQL query string.
   * @returns The supporting GraphqlEndpointManager, or undefined if none support the operation.
   */
  public async findSupportingEndpoint(
    serviceName: string,
    query: string
  ): Promise<GraphqlEndpointManager | undefined> {
    const operation = parseOperation(query);
    if (!operation) {
      return;
    }
    const endpointManagers = this.getEndpointManagers(serviceName);
    // Check each endpoint in priority order
    for (const endpointManager of endpointManagers) {
      const isSupported = await endpointManager.validateOperation(operation);

      if (isSupported) {
        logger.debug(
          `Operation ${operation.operationName || 'anonymous'} supported by ${endpointManager.name}`
        );
        return endpointManager;
      }
    }
    logger.debug(
      `No endpoint supports operation: ${operation.operationName || 'anonymous'}`
    );
    return;
  }

  public async findRedirectEndpoint(serviceName: string, query: string) {
    const operation = parseOperation(query);
    if (!operation) {
      return;
    }

    const endpointManagers = this.getEndpointManagers(serviceName);

    let findEndpointName: string | null = null;

    for (const endpointManager of endpointManagers) {
      const redirectOperations = endpointManager.endpoint.redirectOperations;
      if (redirectOperations) {
        const calledFields = operation.fields || [];
        const findTargetEndpoint = redirectOperations.find((rule) => {
          const redirectFields =
            operation.operationType === OperationTypeNode.QUERY
              ? rule?.operations?.query || []
              : rule?.operations?.mutation || [];

          return redirectFields.some((field) => {
            return calledFields.find((f) => f === field);
          });
        });

        if (findTargetEndpoint) {
          findEndpointName = findTargetEndpoint.targetEndpoint;
          break;
        }
      }
    }

    if (findEndpointName) {
      return this.getEndpointManager(serviceName, findEndpointName);
    }

    return;
  }
}

/**
 * Singleton instance of GraphqlMockManager.
 */
export const graphqlMockManager = new GraphqlMockManager();
