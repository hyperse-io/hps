export interface TestServer<T> {
  app: T;
  destroy?: () => Promise<void> | void | undefined;
}
