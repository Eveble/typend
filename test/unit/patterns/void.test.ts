import { describe, it, expect } from 'vitest';
import { Void } from '../../../src/patterns/void';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Void`, () => {
  it(`extends Pattern`, () => {
    expect(Void.prototype).toBeInstanceOf(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new Void()).not.toThrow(Error);
    });

    it(`has assigned 'VOID' as type kind`, () => {
      const pattern = new Void();
      expect(pattern.getKind()).toBe(KINDS.VOID);
    });
  });
});
