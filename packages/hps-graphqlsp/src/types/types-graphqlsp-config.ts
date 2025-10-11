export type Logger = (msg: string) => void;

export type SchemaItem = {
  name: string;
  schema: string;
};

export type TypesGraphqlspConfig = {
  projectCwd: string;
  outputDir: string;
  graphql: {
    [serviceName: string]: {
      schemas: SchemaItem[];
    };
  };
};
