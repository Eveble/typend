import { expect } from 'chai';
import { Integer } from '../../../src/patterns/integer';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Integer`, function() {
  it(`extends Pattern`, () => {
    expect(Integer.prototype).to.instanceof(Pattern);
  });

  it(`has assigned 'INTEGER' as type kind`, () => {
    const pattern = new Integer();
    expect(pattern.getKind()).to.be.equal(KINDS.INTEGER);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Integer()).not.to.throw(Error);
    });
  });
});
