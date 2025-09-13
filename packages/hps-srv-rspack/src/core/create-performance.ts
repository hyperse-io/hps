import type { RspackOptions } from '@rspack/core';

export const createPerformance = (
  serveMode: boolean,
  performanceOptions: RspackOptions['performance'] = {}
): RspackOptions['performance'] => {
  const basePerformance: RspackOptions['performance'] = {
    // Disable entry size exceeds recommands warning for `serve` mode
    hints: serveMode ? false : 'warning',
  };
  return Object.assign(basePerformance, performanceOptions);
};
