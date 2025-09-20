import type { RuleSetRule } from '@rspack/core';
import { type EntryMapItem } from '../../types/types-entry-map.js';
import { type HpsEvolveOptions } from '../../types/types-options.js';
import { ruleAssets } from './rule-assets.js';
import { ruleCss } from './rule-css.js';
import { ruleLess } from './rule-less.js';
import { ruleScripts } from './rule-scripts.js';
import { ruleSvgIcon } from './rule-svg-icon.js';
export const createRuleSets = (
  serveMode: boolean,
  entryMapItemList: EntryMapItem[],
  evolveOptions: HpsEvolveOptions
): RuleSetRule[] => {
  const entryMapItem = entryMapItemList[0];
  const rules: RuleSetRule[] = [
    ruleSvgIcon(),
    ruleAssets(entryMapItemList, evolveOptions),
    // normal css style.
    ruleCss(serveMode, entryMapItem, evolveOptions, false),
    // css module style. xxx.module.css
    ruleCss(serveMode, entryMapItem, evolveOptions, true),
    ruleLess(serveMode, entryMapItem, evolveOptions),
    ruleScripts(serveMode, entryMapItem, evolveOptions),
  ];

  const extraRuleSets = evolveOptions.rspack?.ruleSets || [];
  return rules.concat(extraRuleSets);
};
