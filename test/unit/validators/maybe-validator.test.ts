import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Maybe } from '../../../src/patterns/maybe';
import { MaybeValidator } from '../../../src/validators/maybe-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import { ValidationError } from '../../../src/errors';

chai.use(sinonChai);

describe(`MaybeValidator`, function () {
  let validator: any;

  beforeEach(() => {
    validator = stubInterface<types.Validator>();
  });

  it(`extends PatternValidator`, () => {
    expect(MaybeValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Maybe', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.canValidate(new Maybe(String))).to.be.true;
      });
    });

    context('implicit expectation', () => {
      it('returns false for any other value that is not instance of Maybe', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.canValidate(undefined)).to.be.false;
        expect(maybeValidator.canValidate(null)).to.be.false;
        expect(maybeValidator.canValidate(true)).to.be.false;
        expect(maybeValidator.canValidate(false)).to.be.false;
      });
    });
  });

  describe('validation', () => {
    context('valid values', () => {
      it('returns true for value as undefined', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.validate(undefined, new Maybe(String), validator))
          .to.be.true;
      });

      it('returns true for value as null', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.validate(null, new Maybe(String), validator)).to
          .be.true;
      });

      it('returns true on successful validation result of value matching expectation delegated to validator', () => {
        const maybeValidator = new MaybeValidator();
        const val = 'my-string';
        const maybe = new Maybe(String);
        validator.validate.withArgs(val, String).returns(true);

        expect(maybeValidator.validate(val, maybe, validator)).to.be.true;
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });
    });

    context('invalid values', () => {
      it('throws ValidationError on failed validation result of value not matching expectation delegated to validator', () => {
        const maybeValidator = new MaybeValidator();
        const val = 'my-string';
        const maybe = new Maybe(String);
        const error = new ValidationError('my-error');
        validator.validate.withArgs(val, String).throws(error);

        expect(() => maybeValidator.validate(val, maybe, validator)).to.throw(
          error
        );
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });
    });
  });
});
