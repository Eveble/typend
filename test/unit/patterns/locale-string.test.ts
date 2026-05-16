import { describe, it, expect } from 'vitest';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';
import { LocaleString } from '../../../src/patterns/locale-string';

describe(`LocaleString`, () => {
  it(`extends Pattern`, () => {
    expect(LocaleString.prototype).toBeInstanceOf(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new LocaleString()).not.toThrow(Error);
    });

    it(`has assigned 'LOCALE_STRING' as type kind`, () => {
      const pattern = new LocaleString();
      expect(pattern.getKind()).toBe(KINDS.LOCALE_STRING);
    });
  });
});
