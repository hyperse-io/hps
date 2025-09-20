import type { Plugins } from '@rspack/core';
import type { DefineVariablesOptions } from '../core/plugins/define-variable-plugin/types.js';

export interface EvolvePlugins {
  external?: Plugins;
  definePlugin?: DefineVariablesOptions;
}
