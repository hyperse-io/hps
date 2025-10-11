export type GenerateIndexService = {
  serviceName: string;
  endpoints: {
    name: string;
    exportedName: string;
    filePath: string;
  }[];
};
