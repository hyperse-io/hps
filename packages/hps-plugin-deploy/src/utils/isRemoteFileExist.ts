/**
 * Configuration options for checking remote file existence
 */
export interface RemoteFileCheckOptions {
  /** HTTP request timeout in milliseconds */
  timeout?: number;
  /** Additional fetch options */
  fetchOptions?: RequestInit;
}

/**
 * Default timeout for remote file checks (5 seconds)
 */
const DEFAULT_TIMEOUT = 1000 * 60; // 1 minute

/**
 * Checks if a file exists on a remote server by making a HEAD request
 *
 * @param httpFilePath - The HTTP URL of the file to check
 * @param options - Optional configuration for the check
 * @returns Promise resolving to true if the file exists, false otherwise
 *
 * @example
 * ```typescript
 * const exists = await isRemoteFileExist('https://example.com/file.jpg');
 * const existsWithTimeout = await isRemoteFileExist('https://example.com/file.jpg', {
 *   timeout: 3000
 * });
 * ```
 */
export const isRemoteFileExist = async (
  httpFilePath: string,
  options: RemoteFileCheckOptions = {}
): Promise<boolean> => {
  const { timeout = DEFAULT_TIMEOUT, fetchOptions = {} } = options;

  // Validate input
  if (!httpFilePath || typeof httpFilePath !== 'string') {
    throw new TypeError('httpFilePath must be a non-empty string');
  }

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(httpFilePath, {
      method: 'HEAD', // Use HEAD for efficiency (no body transfer)
      signal: controller.signal,
      ...fetchOptions,
    });

    clearTimeout(timeoutId);

    // Consider 200 (OK) and 304 (Not Modified) as successful
    return response.status === 200 || response.status === 304;
  } catch (error) {
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          `isRemoteFileExist() request timeout after ${timeout}ms`
        );
      }
      throw new Error(
        `isRemoteFileExist() failed to check remote file: ${error.message}`
      );
    }

    // For non-Error objects, return false (file doesn't exist)
    return false;
  }
};
