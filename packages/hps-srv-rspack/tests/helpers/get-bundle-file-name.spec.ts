import { getBundleFileName } from '../../src/helpers/helper-get-bundle-file-name.js';

describe('@hyperse/hps-srv-rspack get-bundle-file-name', () => {
  it('should correct get bundle file name for single entry item', async () => {
    // for serve Model.
    let bundleFileName = getBundleFileName('css', true, true);
    expect(bundleFileName).toBe(`bundle.css`);
    bundleFileName = getBundleFileName('js', true, true);
    expect(bundleFileName).toBe(`bundle.js`);

    bundleFileName = getBundleFileName('js', false, true);
    expect(bundleFileName).toBe(`bundle[contenthash].js`);
    bundleFileName = getBundleFileName('css', false, true);
    expect(bundleFileName).toBe(`bundle[contenthash].css`);
    bundleFileName = getBundleFileName('css', false, false);
    expect(bundleFileName).toMatch(`bundle.css?`);
    bundleFileName = getBundleFileName('js', false, false);
    expect(bundleFileName).toMatch(`bundle.js?`);
  });
});
