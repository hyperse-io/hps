import type { TemplateOptions } from '@hyperse/html-webpack-plugin-loader';

export type Json =
  | undefined
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [prop: string]: Json };

export type HtmlPluginConfigConfigData = {
  mode: 'development' | 'production';
  /**
   * The random `cdn` for config via `env` template
   */
  envCdn: string;
};

export type EvolveHtmlCdn = string;

export type HtmlPluginConfigTokenType<T extends Json> =
  | T
  | ((configData: HtmlPluginConfigConfigData) => T);

/**
 * The html plugin configuration for each entry item
 */
export type MultiHtmlCDNEntryItem = {
  /**
   * webpack relative or absolute path to the template.
   * It must be an absolute path. `path.join(__dirname, `templates/index-{0}.html`)`
   * @default join(evolveRoot, `/templates/html-plugin/index-{0}.html`)
   */
  templatePath?: string;

  /**
   * Indicates if we need to minify html.
   * @default true
   */
  htmlMinify?: boolean;

  /**
   * Support inject viewport scripts in each modules
   * It only available while `allowPx2rem` = true
   *
   * This script will be injected into headInlineScripts of the html file, position is 'beginning'.
   * @default ''
   */
  viewport?: string;

  /**
   * The title to use for the generated HTML document
   * @default ''
   */
  title?: string;

  /**
   * The favicon url to use for the generated HTML document
   * Should be an path of (32 x 32).png
   */
  favicon?: HtmlPluginConfigTokenType<TemplateOptions['favicon']>;

  /**
   * Allow us customized head meta tags into compiled html template.
   * @default []
   */
  headMetaTags?: HtmlPluginConfigTokenType<TemplateOptions['headMetaTags']>;

  /**
   * The head styles of the page
   * @default []
   */
  headStyles?: HtmlPluginConfigTokenType<TemplateOptions['headStyles']>;

  /**
   * The head scripts of the page
   * @default []
   */
  headScripts?: HtmlPluginConfigTokenType<TemplateOptions['headScripts']>;

  /**
   * The body scripts of the page
   * @default []
   */
  bodyScripts?: HtmlPluginConfigTokenType<TemplateOptions['bodyScripts']>;

  /**
   * The head inline scripts of the page
   * @default []
   */
  headInlineScripts?: HtmlPluginConfigTokenType<
    TemplateOptions['headInlineScripts']
  >;

  /**
   * The head inline styles of the page
   * @default []
   */
  headInlineStyles?: HtmlPluginConfigTokenType<
    TemplateOptions['headInlineStyles']
  >;

  /**
   * Indicates if we need to disable `cdn` plugin.
   * @default false
   */
  cdnDisabled?: boolean;
};
