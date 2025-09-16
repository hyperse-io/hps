import { TemplateParser } from '@hyperse/html-webpack-plugin-loader';

export interface ErrorTemplateData {
  title: string;
  errorMeta: {
    name: string;
    value: string;
  }[];
}

export class ErrorModuleParser extends TemplateParser {
  constructor(htmlSource: string, templateData: ErrorTemplateData) {
    super(htmlSource);
    this.upsertTitleTag(templateData.title);
    this.upsertBodyDocument(templateData);
  }

  private upsertBodyDocument(templateData: ErrorTemplateData) {
    const liFragments = templateData.errorMeta.map((error) => {
      return `<li><span class="name"> ${error.name}: </span><span class="value"> ${error.value} </span></li>`;
    });

    const ulFragment = this.parseFragment(
      `<div class="container"><ul>${liFragments.join('')}</ul></div>`
    );

    const bodyNodes = [...ulFragment.childNodes];

    this.body.childNodes.push(...bodyNodes);
  }
}
