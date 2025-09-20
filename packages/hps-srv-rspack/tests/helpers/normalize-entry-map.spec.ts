import { normalizeEvolveEntryName } from '../../src/helpers/helper-normalize-entry-map.js';

describe('@hyperse/hps-srv-rspack normalize-entry-map', () => {
  it(`should correct resolve evolve entry name`, () => {
    expect(normalizeEvolveEntryName('home', '')).toBe('home');
    expect(normalizeEvolveEntryName('/home', '')).toBe('home');
    expect(normalizeEvolveEntryName('/home/', '')).toBe('home');
    expect(normalizeEvolveEntryName('/home/', '/virtual')).toBe('virtual/home');
    expect(normalizeEvolveEntryName('/home/', 'virtual')).toBe('virtual/home');
    expect(normalizeEvolveEntryName('/home/', '/virtual/')).toBe(
      'virtual/home'
    );
    expect(normalizeEvolveEntryName('/virtual/home', '/virtual/')).toBe(
      'virtual/home'
    );
    expect(normalizeEvolveEntryName('/home/', '/virtual/name')).toBe(
      'virtual/name/home'
    );
    expect(normalizeEvolveEntryName('/home/name', '/virtual/name')).toBe(
      'virtual/name/home/name'
    );
  });
});
