import type { Plugins } from '@rspack/core';
import type { DefineVariablesPluginOptions } from './builtin-plugins/define-variable-plugin.js';
import type { MultiHtmlPluginOptions } from './builtin-plugins/multi-html-plugin.js';
import type { RsdoctorPluginOptions } from './builtin-plugins/rsdoctor-plugin.js';
import type { TsCheckerPluginOptions } from './builtin-plugins/ts-checker-plugin.js';

export interface EvolvePlugins {
  external?: Plugins;
  definePlugin?: DefineVariablesPluginOptions;
  tsCheckerPlugin?: TsCheckerPluginOptions;
  rsdoctorPlugin?: RsdoctorPluginOptions;
  multiHtmlPlugin: MultiHtmlPluginOptions;
}
