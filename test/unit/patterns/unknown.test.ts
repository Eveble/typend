import { expect } from 'chai';
import { Unknown } from '../../../src/patterns/unknown';
import { Pattern } from '../../../src/pattern';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Unknown`, function() {
  it(`extends Pattern`, () => {
    expect(Unknown.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('does not take pattern definition on construction', () => {
      expect(() => new Unknown()).not.to.throw(Error);
    });

    it(`has assigned 'UNKNOWN' a kind of type`, () => {
      const pattern = new Unknown();
      expect(pattern.getKind()).to.be.equal(KINDS.UNKNOWN);
    });
  });
});
