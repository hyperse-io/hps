import { normalizePageProxy } from '../../src/helpers/helper-normalize-page-proxy.js';

describe('@hyperse/hps-srv-rspack normalizePageProxy', () => {
  it('should remove leading and trailing slashes from pageProxy', () => {
    const pageProxy = '/example/';
    const normalized = normalizePageProxy(pageProxy);
    expect(normalized).toBe('/example');
  });

  it('should not remove slashes from the middle of pageProxy', () => {
    const pageProxy = '/example/test/';
    const normalized = normalizePageProxy(pageProxy);
    expect(normalized).toBe('/example/test');
  });

  it('should return an empty string if pageProxy is "/"', () => {
    const pageProxy = '/';
    const normalized = normalizePageProxy(pageProxy);
    expect(normalized).toBe('/pages');
  });

  it('should return an empty string if pageProxy is ""', () => {
    const pageProxy = '';
    const normalized = normalizePageProxy(pageProxy);
    expect(normalized).toBe('/pages');
  });

  it('should return an empty string if pageProxy is undefined', () => {
    const normalized = normalizePageProxy();
    expect(normalized).toBe('/pages');
  });
});
