import { expect } from 'chai';
import { Void } from '../../../src/patterns/void';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Void`, function () {
  it(`extends Pattern`, () => {
    expect(Void.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new Void()).not.to.throw(Error);
    });

    it(`has assigned 'VOID' as type kind`, () => {
      const pattern = new Void();
      expect(pattern.getKind()).to.be.equal(KINDS.VOID);
    });
  });
});
