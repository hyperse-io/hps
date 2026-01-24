import getPort, {
  clearLockedPorts as clearLockedPortsFn,
  portNumbers,
} from 'get-port';

/**
 * Returns a Promise for a port number.
 * @param defaultPort A preferred port or an iterable of preferred ports to use
 * @param host The host on which port resolution should be performed. Can be either an IPv4 or IPv6 address default `dev.hps.com`
 */
export const getAvailablePort = (
  defaultPort: number,
  host = '0.0.0.0'
): Promise<number> => {
  const portRanage = portNumbers(defaultPort, Number(defaultPort) + 10);
  return getPort({ port: portRanage, host });
};

/**
 * Reset locked ports
 * @example
 * ```ts
 * const port = await getAvailablePort(4001);
 * clearLockedPorts();
 * const port2 = await getAvailablePort(4001);
 * console.log(port2);
 * ```
 */
export const clearLockedPorts = () => {
  clearLockedPortsFn();
};
