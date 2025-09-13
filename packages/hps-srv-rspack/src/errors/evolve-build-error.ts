export class EvolveBuildError extends Error {
  public readonly code: string;

  constructor(code: string, messages?: string | string[]) {
    let message: string = code;
    if (messages) {
      message += ': ' + JSON.stringify(messages);
    }
    super(message);
    this.code = code;
  }
}
