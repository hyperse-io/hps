/**
 * A minimalistic http client for populating and querying test data.
 */
export class SimpleHttpClient {
  private headers: { [key: string]: unknown } = {};

  constructor(private apiUrl: string = '') {}

  /**
   * Performs a raw HTTP request to the given URL, but also includes the authToken & channelToken
   * headers if they have been set which make use of REST controllers.
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.headers,
      ...options.headers,
    };
    const apiUrl =
      this.apiUrl.replace(/\/$/, '') + '/' + url.replace(/^\//, '');
    return await fetch(apiUrl, {
      ...options,
      headers,
    });
  }
}
