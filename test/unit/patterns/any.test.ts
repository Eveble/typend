import { expect } from 'chai';
import { Any } from '../../../src/patterns/any';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Any`, () => {
  it(`extends Pattern`, () => {
    expect(Any.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Any()).not.to.throw(Error);
    });

    it(`has assigned 'ANY' a kind of type`, () => {
      const pattern = new Any();
      expect(pattern.getKind()).to.be.equal(KINDS.ANY);
    });
  });
});
