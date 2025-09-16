import { normalizeGroupName } from '../../src/helpers/helper-normalize-group-name.js';

describe('normalize-group-name.spec', () => {
  it('generate group name', async () => {
    const projectVirtualPath = 'flat/evolve/';
    expect(normalizeGroupName(projectVirtualPath, 1)).toBe('flat/evolve/b');
    expect(normalizeGroupName(projectVirtualPath, 27)).toBe('flat/evolve/B');
    expect(normalizeGroupName(projectVirtualPath, 51)).toBe('flat/evolve/Z');
    expect(normalizeGroupName(projectVirtualPath, 52)).toBe('flat/evolve/a1');
  });
});
