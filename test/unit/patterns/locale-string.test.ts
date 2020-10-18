import { expect } from 'chai';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';
import { LocaleString } from '../../../src/patterns/locale-string';

describe(`LocaleString`, () => {
  it(`extends Pattern`, () => {
    expect(LocaleString.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new LocaleString()).not.to.throw(Error);
    });

    it(`has assigned 'LOCALE_STRING' as type kind`, () => {
      const pattern = new LocaleString();
      expect(pattern.getKind()).to.be.equal(KINDS.LOCALE_STRING);
    });
  });
});
