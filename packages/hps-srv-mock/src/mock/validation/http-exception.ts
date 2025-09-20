export class HttpException extends Error {
  constructor(public readonly errors?: string[]) {
    super();
  }
}
