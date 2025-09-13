import {
  type EvolveMultiCDNConfig,
  type EvolveMultiCDNEnvResolver,
  type EvolveMultiCdnEnvType,
} from '../types/types-multi-html.js';

export function httpUrlJoin(first = '', second = '') {
  return first.replace(/\/$/, '') + '/' + second.replace(/^\//, '');
}

/**
 * To extract the best matched CDN configuration url address, either use URL `query.env` or customize the `envRresolver`
 * @param cdnConfig List of pre-configured cdn urls for each environment
 * @param envResolver Get the specific environment variable by the currently requested host url address.
 * @returns Returns the best matching address with a suffix (`/`)
 */
export function cdnFinder(
  cdnConfig: EvolveMultiCDNConfig,
  envResolver?: EvolveMultiCDNEnvResolver
): string {
  const regex = /[?&]env(=([^&#]*)|&|#|$)/;
  const locationHref = window.location.href;
  const results = regex.exec(locationHref);
  let env =
    results && results[2]
      ? decodeURIComponent(results[2].replace(/\+/g, ' '))
      : 'prod';

  // If we have customized cdn resolver using it first.
  env = (envResolver && envResolver(locationHref)) || env;

  const matchedCdnList: string[] =
    cdnConfig[env as EvolveMultiCdnEnvType] || cdnConfig['prod'] || [];
  const matchedCdn =
    matchedCdnList[Math.floor(Math.random() * matchedCdnList.length)];
  // ensure has endfix slash
  return matchedCdn.replace(/\/$/, '') + '/';
}

export function findEnvCdn(
  cdnConfig: EvolveMultiCDNConfig = {},
  env: EvolveMultiCdnEnvType = 'prod'
) {
  const matchedCdnList: string[] = cdnConfig[env] || cdnConfig['prod'] || [];
  return matchedCdnList[Math.floor(Math.random() * matchedCdnList.length)];
}

export function injectFederationScripts(
  cdnConfig: EvolveMultiCDNConfig,
  cdnResolver: EvolveMultiCDNEnvResolver = function cdnResolver() {
    return undefined;
  }
) {
  return `window.evolveFetchMicroWidgets = function () {
    var cdnConfig = ${JSON.stringify(cdnConfig)};
    var cdnResolver = ${cdnResolver.toString()};
    var cdnFinder = ${cdnFinder.toString()};
    return (cdnFinder(cdnConfig, cdnResolver) || '').replace(/\\/$/, '');
  }
  `;
}
