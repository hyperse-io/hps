import { toFixed } from '../pixel-util.js';

describe('@hyperse/hps-srv-postcss-plugin-pixel', () => {
  it('the toFixed() should be ok', () => {
    expect(toFixed(0.42, 2)).toBe(0.42);
    expect(toFixed(0.45, 2)).toBe(0.45);
    expect(toFixed(0.46, 2)).toBe(0.46);
    expect(toFixed(0.482, 2)).toBe(0.48);
    expect(toFixed(0.485, 2)).toBe(0.49);
    expect(toFixed(0.485, 2)).toBe(0.49);
    expect(toFixed(0.49, 2)).toBe(0.49);
  });
});
