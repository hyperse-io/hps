import type { Plugins } from '@rspack/core';
import type { DefineVariablesPluginOptions } from './builtin-plugins/define-variable-plugin.js';
import type { HtmlPluginOptions } from './builtin-plugins/html-plugin.js';
import type { RsdoctorPluginOptions } from './builtin-plugins/rsdoctor-plugin.js';
import type { TsCheckerPluginOptions } from './builtin-plugins/ts-checker-plugin.js';

export interface EvolvePlugins {
  externalPlugins?: Plugins;
  definePlugin?: DefineVariablesPluginOptions;
  tsCheckerPlugin?: TsCheckerPluginOptions;
  rsdoctorPlugin?: RsdoctorPluginOptions;
  htmlPlugin: HtmlPluginOptions;
}
