import { describe, it, expect } from 'vitest';
import { Unknown } from '../../../src/patterns/unknown';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Unknown`, () => {
  it(`extends Pattern`, () => {
    expect(Unknown.prototype).toBeInstanceOf(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Unknown()).not.toThrow(Error);
    });

    it(`has assigned 'UNKNOWN' a kind of type`, () => {
      const pattern = new Unknown();
      expect(pattern.getKind()).toBe(KINDS.UNKNOWN);
    });
  });
});
