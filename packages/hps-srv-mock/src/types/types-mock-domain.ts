/**
 * Prepare available mock domain information
 */
export interface MockDomainData {
  /**
   * The mock domain url
   * @example `http://dev.hps.com:3001/
   */
  domain: string;
  /**
   * The host base url.
   * @example `http://dev.hps.com:3001`
   * Without last slash.
   */
  hostUri: string;
  /**
   * The public ip address of local server
   */
  publicIp: string;
  /**
   * available port
   * @example `3001`
   */
  mockPort: number;
  /**
   * The server listened on
   * @example `0.0.0.0`
   */
  listenHostName: string;
}
