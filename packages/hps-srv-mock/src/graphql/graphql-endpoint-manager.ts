import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import type { GraphQLSchema } from 'graphql';
import { buildClientSchema, validate } from 'graphql';
import { join } from 'path';
import { generate } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { logger } from '@hyperse/hps-srv-common';
import { HPS_MOCK_GRAPHQL_SCHEMA_DIR } from '../constants.js';
import { getMockCacheDir } from '../esm-task/get-mock-cache-dir.js';
import { assertPath } from '../helpers/assert-path.js';
import type { GraphqlOperationInfo } from '../helpers/parse-gql-operation.js';
import type { GraphqlMockEndpoint } from '../types/types-graphql.js';
import type {
  HpsMockApplicationOptions,
  HpsMockOptions,
} from '../types/types-options.js';
import { downloadIntrospectionSchema } from './download-introspection-schema.js';

export class GraphqlEndpointManager {
  private gqlSchemaDir: string;
  private astSchemaFilePath: string;
  private introspectionSchemaFilePath: string;

  private hasIntrospectionSchema: boolean = false;
  private hasParsedAstSchema: boolean = false;

  // cached ast schema
  private astSchema: string | null = null;
  // cached introspection schema
  private introspectionSchema: GraphQLSchema | null = null;

  // cached mock config
  private mockConfig: {
    proxyPath: string;
    serviceUrl: string;
  };

  constructor(
    private readonly mockOptions: HpsMockOptions,
    private readonly serviceName: string,
    public readonly name: string,
    public readonly endpoint: GraphqlMockEndpoint,
    private readonly applicationOptions: HpsMockApplicationOptions
  ) {
    this.gqlSchemaDir = join(
      getMockCacheDir(mockOptions),
      HPS_MOCK_GRAPHQL_SCHEMA_DIR,
      serviceName
    );
    this.introspectionSchemaFilePath = join(
      this.gqlSchemaDir,
      this.name + '.json'
    );
    this.astSchemaFilePath = join(this.gqlSchemaDir, this.name + '.graphql');
    this.ensureGqlSchemaDir();
    this.cleanEndpointCache();
    this.hasIntrospectionSchema = false;
    this.hasParsedAstSchema = false;
    this.setupMockConfig();
  }

  private cleanEndpointCache(): void {
    [this.introspectionSchemaFilePath, this.astSchemaFilePath].forEach(
      (filePath) => {
        if (existsSync(filePath)) {
          rmSync(filePath, {
            recursive: true,
            force: true,
          });
        }
      }
    );
  }

  private ensureGqlSchemaDir() {
    if (!existsSync(this.gqlSchemaDir)) {
      mkdirSync(this.gqlSchemaDir, { recursive: true });
    }
  }

  private setupMockConfig() {
    const serviceUrl = assertPath(
      this.mockOptions.apiContext || '/api',
      this.serviceName,
      this.name
    );
    const proxyPath = assertPath('/', this.serviceName, this.name);
    const hostUri = (this.applicationOptions?.hostUri || '').replace(/\/$/, '');
    this.mockConfig = {
      proxyPath,
      serviceUrl: `${hostUri}${serviceUrl}`,
    };
  }

  public getMockConfig(): {
    proxyPath: string;
    serviceUrl: string;
  } {
    return this.mockConfig;
  }

  public async downloadIntrospectionSchema() {
    try {
      const result = await downloadIntrospectionSchema(
        this.endpoint.url,
        this.introspectionSchemaFilePath
      );
      this.hasIntrospectionSchema = result;
      if (!result) {
        logger.warn(`Error downloading introspection schema for ${this.name}`);
      }
    } catch (error: any) {
      logger.warn(
        `Error downloading introspection schema for ${this.name}: ${error?.message || error}`
      );
      this.hasIntrospectionSchema = false;
    }
  }

  public async parseAstSchema() {
    if (!this.hasIntrospectionSchema) {
      return;
    }
    const generates: Record<string, Types.ConfiguredOutput> = {
      [this.astSchemaFilePath]: {
        schema: [this.introspectionSchemaFilePath],
        plugins: ['schema-ast'],
      },
    };
    try {
      const result: Types.FileOutput[] = await generate({
        overwrite: true,
        generates,
      });
      const filePaths = result.map((result) => result.filename);
      this.hasParsedAstSchema = filePaths.includes(this.astSchemaFilePath);
      if (!this.hasParsedAstSchema) {
        logger.warn(`GraphQL schema not found for ${this.name}`);
      }
    } catch (error: any) {
      this.hasParsedAstSchema = false;
      logger.warn(
        `GraphQL schema generation failed for ${this.name}: ${error?.message || error}`
      );
    }
  }

  public getIntrospectionSchema(): GraphQLSchema | null {
    if (this.introspectionSchema) {
      return this.introspectionSchema;
    }
    if (!this.hasIntrospectionSchema) {
      return null;
    }
    if (!existsSync(this.introspectionSchemaFilePath)) {
      return null;
    }
    const result = readFileSync(this.introspectionSchemaFilePath, 'utf8');
    let obj;
    try {
      obj = JSON.parse(result);
    } catch (error: any) {
      logger.warn(
        `Invalid introspection JSON for ${this.name}: ${error?.message || error}`
      );
      return null;
    }
    if (!obj['data']) {
      return null;
    }
    const introspectionSchema = buildClientSchema(obj['data']);
    this.introspectionSchema = introspectionSchema;
    return introspectionSchema;
  }

  public async getAstSchema(): Promise<string | null> {
    if (this.astSchema) {
      return this.astSchema;
    }
    if (!this.hasParsedAstSchema) {
      await this.parseAstSchema();
    }
    if (!this.hasParsedAstSchema) {
      return null;
    }
    const result = readFileSync(this.astSchemaFilePath, 'utf8');
    this.astSchema = result;
    return result;
  }

  public async validateOperation(
    operation: GraphqlOperationInfo
  ): Promise<boolean> {
    try {
      const schema = this.getIntrospectionSchema();
      if (!schema) {
        return false;
      }
      const errors = validate(schema, operation.document);
      return errors.length === 0;
    } catch (error: any) {
      logger.debug(
        `Validation error for endpoint ${this.name}: ${error.message}`
      );
      return false;
    }
  }
}
