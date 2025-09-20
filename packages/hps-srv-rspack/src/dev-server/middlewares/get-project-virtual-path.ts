import { type HpsEvolveOptions } from '../../types/types-options.js';

export const getProjectVirtualPath = (evolveOptions: HpsEvolveOptions) => {
  return evolveOptions.projectVirtualPath.replace(/^\//, '');
};
