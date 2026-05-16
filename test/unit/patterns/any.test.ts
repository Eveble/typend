import { describe, it, expect } from 'vitest';
import { Any } from '../../../src/patterns/any';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Any`, () => {
  it(`extends Pattern`, () => {
    expect(Any.prototype).toBeInstanceOf(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Any()).not.toThrow(Error);
    });

    it(`has assigned 'ANY' a kind of type`, () => {
      const pattern = new Any();
      expect(pattern.getKind()).toBe(KINDS.ANY);
    });
  });
});
