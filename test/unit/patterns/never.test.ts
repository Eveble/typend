import { describe, it, expect } from 'vitest';
import { Never } from '../../../src/patterns/never';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Never`, () => {
  it(`extends Pattern`, () => {
    expect(Never.prototype).toBeInstanceOf(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new Never()).not.toThrow(Error);
    });

    it(`has assigned 'NEVER' as type kind`, () => {
      const pattern = new Never();
      expect(pattern.getKind()).toBe(KINDS.NEVER);
    });
  });
});
