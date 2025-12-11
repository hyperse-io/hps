/**
 * the configuration file of `hps-mock`
 * hps-mock.config.ts,.mjs,.mts
 */
export const configFileName = `hps-mock`;

export const HPS_MOCK_FN_TYPE = `hps-mock-fn-type`;
export const HPS_MOCK_FN_NAME = `hps-mock-fn-name`;
export const HPS_MOCK_META = `Hps-Mock-Meta`;

export const HPS_MOCK_GRAPHQL_SCHEMA_DIR = 'graphql-schema';

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
  const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAD20lEQVR4AcRW2yt1QRT/zXGNEC9uL5Ik5C4p11yKck2UXB5EJ0rKm5KS8s6foJRHibzyDyhE8eIZeUHuvm//htlm77P3uexPfaczM2vWrFnrt9das2Z8f/7zzwcPv/f3dw+7nLdEDMBwGLq6urCzswPSzmrD57oC+Pj4cDVwfn6O3t5edHZ24uTkJHxrDpKuAI6Pj9Hf34/Ly8uAbUIIfH5+Yn9/H9XV1ZidncX19XWAXDgMXzCh7e1tlJeXY3FxEff396ZodHS0Sb+8vGB9fR3FxcVYW1sD5+ZiGERQANz/+PiIlZUVlJSU4O7ujizoACTD6G5ubjA3N4eqqirs7e25hs8QtfxdAfh81qWrqyvz62JiYixK1IRJeXp6KpOUiXp2dhYSiNWK0mSMQgijt/4Zd3LcAHCNjXK7u7uorKzE/Pw8gh1bVwB2D1Axv5CjHUBUVBTZAe35+VnmBcMYsPjNiAgAv0QIATsAxr2trQ3x8fHfan8Ggua+H46VigjA29ub3G1PwszMTLS3t2N6ehqFhYVSRu9YU/S5TnsCwATLz8+HEF95QgA03traipqaGl2/pD0BYFyF+DIgtRjd6+ur0QOlpaUYHh7G0NAQ0tLSQH5CQgI6OjrQ19cnZfTOMwBdCWkVgpaWFoyPj6OxsRF+v1/WCK6zJSUlcbA0TwCcToECQO05OTmYnJxEd3c3CgoKyJJNCKvXyPQEgCHgZr3pALa2tsDixJgz9krODpyn4NcA6Mfp8PAQZWVlWF5extPTk7IPJ+AsTKaAjfDZ5ubUSZHuAQo+PDxgaWkJFRUV4M1Int0D5HkGIIQ1ngsLCzg4OADdGhcXR92yXVxcYHV1VdJOwD0DkBq17ujoCDwBIyMjuL291VZg1nsnAL+WA7RIZZubm9jY2ODUbMwPesYJAPmmoI1wzYHY2Fh5xJKTk21bnKcsRlxxAuA5BM3NzbK+19fXg4BowK2pBHUC4MkDVOQ3qhwfniyxpIuKisz6bweiANBjubm5phyNe/IADfDa5dfPzMyA3hgcHMTY2BiysrK4bGnMATISExMxOjqKgYEBpKamkiUfsJJw6FxzQJflV/EZPjExIes/R5Zgve4rACkpKeApaWpqkvcE7wun2qD0hwVACWdnZ8tLiJ6gR3gF19XVyQeKCoEQAnl5eZiampJvQ4YvIyNDqQgYIwLA3fwaPsFpnMqZI8wPvg+4rhofLbW1tTKJVSjUmj5GDEBt5qloaGiQBuiNnp4etWQZGSbmhYWpTTwDoA4hBBhz5gcfKEJYSzdlQrV/AqCUCyGQnp6uppYx1OQvAAAA///1gyQyAAAABklEQVQDAJoG2NCvIIvfAAAAAElFTkSuQmCC`;
  return Buffer.from(iconBase64, 'base64');
};
