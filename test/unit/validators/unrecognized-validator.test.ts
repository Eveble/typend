import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { UnrecognizedValidator } from '../../../src/validators/unrecognized-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { Unrecognized } from '../../../src/patterns/unrecognized';
import { types } from '../../../src/types';
import { UnknownError } from '../../../src/errors';

describe(`UnrecognizedValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(UnrecognizedValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('construction', () => {
    it('takes default behavior as a boolean and assigns it', () => {
      expect(new UnrecognizedValidator(true).getDefaultBehavior()).to.be.true;
      expect(new UnrecognizedValidator(false).getDefaultBehavior()).to.be.false;
    });
  });

  describe('evaluation', () => {
    it('returns true for pattern instance of Unrecognized', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      expect(
        unrecognizedValidator.canValidate(
          new Unrecognized('unrecognized-value')
        )
      ).to.be.true;
    });

    it('returns false for any other implicit expectation', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      expect(unrecognizedValidator.canValidate(true)).to.be.false;
      expect(unrecognizedValidator.canValidate(false)).to.be.false;
      expect(unrecognizedValidator.canValidate(undefined)).to.be.false;
      expect(unrecognizedValidator.canValidate(null)).to.be.false;
    });
  });

  describe('validation', () => {
    it('returns true for unrecognized value as default behavior assigned on validator construction', () => {
      const unrecognizedValidator = new UnrecognizedValidator(true);
      const val = 'my-unrecognized-value';
      const unrecognized = new Unrecognized('unrecognized-value');
      expect(unrecognizedValidator.validate(val, unrecognized)).to.be.true;
    });

    it('throws UnknownError for unrecognized value as default behavior assigned on validator construction', () => {
      const unrecognizedValidator = new UnrecognizedValidator(false);
      const val = 'my-unrecognized-value';
      const expectation = 'unrecognized-value';
      const unrecognized = new Unrecognized(expectation);
      const valStr = inspect(val);
      const expectationStr = inspect(expectation);
      describer.describe.withArgs(val).returns(valStr);
      describer.describe.withArgs(expectation).returns(expectationStr);

      expect(() => unrecognizedValidator.validate(val, unrecognized)).to.throw(
        UnknownError,
        `Unrecognized expectation ${expectationStr} that cannot handle ${valStr} value`
      );
    });
  });
});
