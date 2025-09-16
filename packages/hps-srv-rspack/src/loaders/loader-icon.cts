import { type Config, optimize } from 'svgo';

const VIEWBOX_REGEX = /viewBox="([^"]*)"/;
const SVG_REGEX = /<svg[^>]*>|<\/svg>/g;
const FILL_REGEX = /fill="[^"]*"/g;

const svgOptimize = (buffer, svgoOption: Config) => {
  const { data } = optimize(buffer, svgoOption);
  return data;
};

const iconLoader = function iconLoader(source) {
  if (this.cacheable) this.cacheable(true);
  const options = this.getOptions() as { svgo: Config };
  const callback = this.async();

  try {
    const optimizedSource = svgOptimize(source, options.svgo);
    const finalSource = optimizedSource.replace(FILL_REGEX, (fill) => {
      return fill.includes('#FFF') ? 'fill="currentColor"' : '';
    });
    // Issue with ESLint recognizing this as needing an object destructure
    const viewBoxMatch = VIEWBOX_REGEX.exec(finalSource);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';
    const svgExport = JSON.stringify({
      viewBox,
      body: finalSource.replace(SVG_REGEX, ''),
    });
    callback(null, `module.exports.default = module.exports = ${svgExport}`);
  } catch (err) {
    callback(err as Error);
  }
};

module.exports = iconLoader;
