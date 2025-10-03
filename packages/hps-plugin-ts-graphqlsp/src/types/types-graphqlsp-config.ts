export type Logger = (msg: string) => void;

export interface TypesGraphqlspConfig {
  projectCwd: string;
  outputDir: string;
  schemas: {
    name: string;
    schema: string;
  }[];
}
