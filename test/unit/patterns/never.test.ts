import { expect } from 'chai';
import { Never } from '../../../src/patterns/never';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Never`, () => {
  it(`extends Pattern`, () => {
    expect(Never.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern expectation on construction', () => {
      expect(() => new Never()).not.to.throw(Error);
    });

    it(`has assigned 'NEVER' as type kind`, () => {
      const pattern = new Never();
      expect(pattern.getKind()).to.be.equal(KINDS.NEVER);
    });
  });
});
