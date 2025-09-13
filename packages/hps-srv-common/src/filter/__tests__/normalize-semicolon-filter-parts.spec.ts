import { normalizeSemicolonFilterParts } from '../normalize-semicolon-filter-parts.js';

describe('should correct handle options filter: `a;b;c`', () => {
  it('should correct normalize semicolon parts', () => {
    let filtered = normalizeSemicolonFilterParts(['abc', '', 'abc;cdf']);
    expect(filtered).toHaveLength(2);
    expect(filtered).toStrictEqual(['abc', 'cdf']);
    filtered = normalizeSemicolonFilterParts(['abc', 'abc;cdf']);
    expect(filtered).toHaveLength(2);
    expect(filtered).toStrictEqual(['abc', 'cdf']);
    filtered = normalizeSemicolonFilterParts(['abc', '']);
    expect(filtered).toHaveLength(1);
    filtered = normalizeSemicolonFilterParts([]);
    expect(filtered).toHaveLength(0);
  });
});
