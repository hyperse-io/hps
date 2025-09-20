import { TemplateParser } from '@hyperse/html-webpack-plugin-loader';

export interface MainTemplateModuleItemData {
  name: string;
  link: string;
  flagText: string;
  isServed: 1 | 0;
}

export interface MainTemplateData {
  title: string;
  modules: MainTemplateModuleItemData[];
}

export class MainModuleParser extends TemplateParser {
  constructor(htmlSource: string, templateData: MainTemplateData) {
    super(htmlSource);
    this.upsertTitleTag(templateData.title);
    this.upsertBodyDocument(templateData);
  }

  private upsertBodyDocument(templateData: MainTemplateData) {
    const headerFragment = this.parseFragment(
      `<div class="header"><div class="logo"></div><span>${templateData.title}</span></div>`
    );

    const liFragments = templateData.modules.map((module, index) => {
      return `<li><a href="${module.link}">${index + 1}. ${module.name}</a><span class="${module.flagText}">${module.flagText}</span></li>`;
    });

    const ulFragment = this.parseFragment(`<ul>${liFragments.join('')}</ul>`);

    const bodyNodes = [...headerFragment.childNodes, ...ulFragment.childNodes];

    this.body.childNodes.push(...bodyNodes);
  }
}
