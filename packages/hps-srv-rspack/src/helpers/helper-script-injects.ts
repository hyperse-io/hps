export function httpUrlJoin(first = '', second = '') {
  return first.replace(/\/$/, '') + '/' + second.replace(/^\//, '');
}

export function injectFederationScripts(htmlCdn: string) {
  return `window.evolveFetchMicroWidgets = function () {
    return ${JSON.stringify(htmlCdn)};
  }
  `;
}
