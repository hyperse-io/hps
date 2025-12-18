export const getRuntimeCDNBase = (htmlCdn: string, requireFn?: string) => {
  const result: string[] = [
    `
  (function () {
    var runtimeCDNBase = ${JSON.stringify(htmlCdn || '')};
    window.$evolve = window.$evolve || {};
    if (window.$evolve.runtimeCDNBase) {
      // Use injected runtimeCDNBase as higher priority, e.g we have native webview runtime base URL.
      runtimeCDNBase = window.$evolve.runtimeCDNBase;
    } else {
      window.$evolve.runtimeCDNBase = runtimeCDNBase;
    }
  `,
  ];

  if (requireFn) {
    result.push(
      // NOTE: provider a opportunity override by user, but not recommend.
      `${requireFn} = runtimeCDNBase || ${requireFn};`
    );
  }
  result.push('})();');

  return result.join('\n');
};
