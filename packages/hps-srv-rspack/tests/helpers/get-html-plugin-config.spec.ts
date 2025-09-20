import {
  defaultHtmlPluginConfig,
  getHtmlPluginConfig,
} from '../../src/helpers/helper-get-html-plugin-config.js';
import type { MultiHtmlCDNEntryItem } from '../../src/index.js';
import { type EvolveEntryItemOption } from '../../src/types/types-entry-map.js';

describe('@hyperse/hps-srv-rspack get-html-plugin-config', () => {
  it('should correct extract html plugin config parameters', async () => {
    const entryItemOption: EvolveEntryItemOption = {
      title: '11',
      favicon: {
        href: '22',
        rel: 'icon',
        attributes: {
          type: 'image/png',
        },
      },
      headMetaTags: ['11'],
      headInlineScripts: [
        {
          id: '22',
          content: '22',
          position: 'beginning',
          order: 1,
        },
      ],
      headInlineStyles: [
        {
          id: '33',
          content: '33',
          position: 'beginning',
          order: 1,
        },
      ],
      headStyles: [
        {
          id: '44',
          href: '44',
          position: 'beginning',
          order: 1,
        },
      ],
      headScripts: [
        {
          id: '55',
          src: '55',
          position: 'beginning',
          order: 1,
        },
      ],
      bodyScripts: [
        {
          id: '66',
          src: '66',
          position: 'beginning',
          order: 1,
        },
      ],
      viewport: 'viewport',
      htmlMinify: true,
      templatePath: '/templates/index-{0}.html',
    };
    for (const [key, value] of Object.entries(entryItemOption)) {
      expect(
        getHtmlPluginConfig(
          key as keyof MultiHtmlCDNEntryItem,
          { mode: 'development', envCdn: '' },
          value
        )
      ).toBe(value);
    }

    for (const item of Object.keys(entryItemOption)) {
      expect(
        getHtmlPluginConfig(item as any, { mode: 'development', envCdn: '' })
      ).toBe(defaultHtmlPluginConfig[item as keyof MultiHtmlCDNEntryItem]);
    }
  });
});
