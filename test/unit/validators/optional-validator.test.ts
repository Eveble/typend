import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { Optional } from '../../../src/patterns/optional';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { OptionalValidator } from '../../../src/validators/optional-validator';
import { ValidationError } from '../../../src/errors';

use(sinonChai);

describe(`Optional`, () => {
  let validator: any;

  beforeEach(() => {
    validator = stubInterface<types.Validator>();
  });

  it(`extends PatternValidator`, () => {
    expect(OptionalValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Optional', () => {
        const optionalValidator = new OptionalValidator();
        expect(optionalValidator.canValidate(new Optional(String))).to.be.true;
      });
    });

    context('implicit expectation', () => {
      it('returns false for any other implicit expectation that is not instance of Optional', () => {
        const optionalValidator = new OptionalValidator();
        expect(optionalValidator.canValidate(undefined)).to.be.false;
        expect(optionalValidator.canValidate(null)).to.be.false;
        expect(optionalValidator.canValidate(true)).to.be.false;
        expect(optionalValidator.canValidate(false)).to.be.false;
      });
    });
  });

  describe('validation', () => {
    context('valid values', () => {
      it('returns true for value as undefined', () => {
        const optionalValidator = new OptionalValidator();
        expect(
          optionalValidator.validate(undefined, new Optional(String), validator)
        ).to.be.true;
      });

      it('returns true on successful validation result of value matching expectation delegated to validator', () => {
        const optionalValidator = new OptionalValidator();
        const val = 'my-string';
        const optional = new Optional(String);
        validator.validate.withArgs(val, String).returns(true);

        expect(optionalValidator.validate(val, optional, validator)).to.be.true;
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });
    });

    context('invalid values', () => {
      it('runs validation on non-null values against validator', () => {
        const optionalValidator = new OptionalValidator();

        const val = null;
        const optional = new Optional(String);
        const error = new ValidationError('my-error');

        validator.validate.withArgs(val, String).throws(error);

        expect(() =>
          optionalValidator.validate(val, optional, validator)
        ).to.throw(error);
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });

      it('throws ValidationError on failed validation result of value not matching expectation delegated to validator', () => {
        const optionalValidator = new OptionalValidator();

        const val = 'my-string';
        const optional = new Optional(String);
        const error = new ValidationError('my-error');

        validator.validate.withArgs(val, String).throws(error);

        expect(() =>
          optionalValidator.validate(val, optional, validator)
        ).to.throw(error);
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });
    });
  });
});
