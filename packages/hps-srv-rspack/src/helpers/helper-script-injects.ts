import { type EvolveHtmlCdn } from '../types/types-multi-html.js';

export function httpUrlJoin(first = '', second = '') {
  return first.replace(/\/$/, '') + '/' + second.replace(/^\//, '');
}

export function injectFederationScripts(htmlCdn: EvolveHtmlCdn) {
  return `window.evolveFetchMicroWidgets = function () {
    return ${htmlCdn};
  }
  `;
}
