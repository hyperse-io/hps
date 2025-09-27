/**
 * the configuration file of `hps-mock`
 * hps-mock.config.ts,.mjs,.mts
 */
export const configFileName = `hps-mock`;

export const HPS_MOCK_FN_TYPE = `hps-mock-fn-type`;
export const HPS_MOCK_FN_NAME = `hps-mock-fn-name`;
export const HPS_MOCK_META = `Hps-Mock-Meta`;

export enum hpsMockTypes {
  'FUNC' = 'FUNC',
  'FUNC_SIMPLE' = 'FUNC_SIMPLE',
  'REST' = 'REST',
  'OTHER' = 'OTHER',
}

/**
 * Convert hps_favicon.png into base64 buffer.
 */
export const faviconIcon = (): Buffer => {
  // meta is `data:image/png;base64,`
  const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAMAAAANf8AYAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAARFQTFRFAAAAOTFBOTVBOTlBFRUVQTpKaS/GaTDGaTHHajLHajPIajXJajbJazjKbDrLbDzMbD7MbD7NbEHNbEPObETPbUbPbUfQbUnQbUvRbU3SbU/SbVDTblLTblTUblbVbljVblrWblzWbl3Xb2DYb2LYb2TZb2XZb2fab2rbcGzbcG7ccW/ccXLdcnPdcnXecnffc3rfc3zgc37gc4Dhc4Pic4TiTE9cs5vl////7uz6k3jcf2PXf2TYgGbYgGjZgGragGzagG3agG/agHDbgXPcgXTcgXbdgXfdgXnegXzfgn3fgH3fhGbY5eL3f3reEBAQUERhUEdhUEdjU0ljU0xjU05jU05mU1BmU1NmU1VmDQ0aKaYoegAAAFt0Uk5TCkNDQwxP////////////////////////////////////////////////////////////////Yf///////////////////////////////xBsbGxsbGxsbGxsFKjHmBsAAAChSURBVHicY2BgZMIPmNEBCwMrGzsHJxc3Dy8vH7+AoJCwiKiYuISklLSMrJy8gqKSsoqqmrqGppa2jq6evoGhkbGJqdmw12NugQ1YDm09VtY2tnb2Do5Ozi6ubu4enl7ehPX4kBFuo3pG9Qx2PejAd4jrQc/bfoMorEf1jOoZZnoGc9uFGD3+AYFAEAQEwQgQEhISCgZhQBAOAhEQEAkEUQBE8F/uPJrcJQAAAABJRU5ErkJggg==`;
  return Buffer.from(iconBase64, 'base64');
};
