import { describe, it, expect } from 'vitest';
import { Integer } from '../../../src/patterns/integer';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Integer`, () => {
  it(`extends Pattern`, () => {
    expect(Integer.prototype).toBeInstanceOf(Pattern);
  });

  it(`has assigned 'INTEGER' as type kind`, () => {
    const pattern = new Integer();
    expect(pattern.getKind()).toBe(KINDS.INTEGER);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Integer()).not.toThrow(Error);
    });
  });
});
