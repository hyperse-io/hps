import ip from 'ip';
import { getAvailablePort } from './get-available-port.js';

export type GetAvailableDomainOptions = {
  port?: number;
  hostname?: string;
  isHttps?: boolean;
};

export type GetAvailableDomainData = {
  domain: string;
  port: number;
  hostUri: string;
  publicIp: string;
  listenHostName: string;
};

/**
 * Get available domain information
 * @param options
 */
export const getAvailableDomain = async (
  options: GetAvailableDomainOptions
): Promise<GetAvailableDomainData> => {
  const listenHostName = '0.0.0.0';
  const { port = 6001, hostname = 'dev.hps.com' } = options;
  let availablePort = port;
  try {
    availablePort = await getAvailablePort(port, listenHostName);
  } catch {
    throw new Error(`No available port!`);
  }
  // Mock service domain URI
  const domain = `${options.isHttps ? 'https' : 'http'}://${hostname}:${String(
    availablePort
  )}`;

  const publicIp = ip.address();

  // The hostUri without last slash `/`.
  const hostUri = domain.replace(/\/$/, '');
  return {
    domain,
    port: availablePort,
    hostUri,
    publicIp,
    listenHostName,
  };
};
