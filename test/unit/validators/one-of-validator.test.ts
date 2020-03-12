import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { OneOf } from '../../../src/patterns/one-of';
import { OneOfValidator } from '../../../src/validators/one-of-validator';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { ValidationError, NotAMemberError } from '../../../src/errors';

chai.use(sinonChai);

describe(`OneOf`, function() {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(OneOfValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of OneOf', () => {
        const oneOfValidator = new OneOfValidator();
        expect(oneOfValidator.canValidate(new OneOf(String, Number))).to.be
          .true;
      });
    });

    context('implicit expectation', () => {
      it('returns false for any other implicit expectation that is not instance of OneOf', () => {
        const oneOfValidator = new OneOfValidator();
        expect(oneOfValidator.canValidate(undefined)).to.be.false;
        expect(oneOfValidator.canValidate(null)).to.be.false;
        expect(oneOfValidator.canValidate(true)).to.be.false;
        expect(oneOfValidator.canValidate(false)).to.be.false;
      });
    });
  });

  describe('validation', () => {
    context('valid values', () => {
      it('returns true on successful validation of value matching first provided expectation on OneOf instance', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 'my-string';
        const oneOf = new OneOf(String, Number);
        validator.validate.withArgs(val, String).returns(true);

        expect(oneOfValidator.validate(val, oneOf, validator)).to.be.true;
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly(val, String);
      });

      it('returns true on successful validation of value matching other then first provided expectation on OneOf instance', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 2;
        const oneOf = new OneOf(String, Number);
        validator.validate.withArgs(val, String).returns(false);
        validator.validate.withArgs(val, Number).returns(true);

        expect(oneOfValidator.validate(val, oneOf, validator)).to.be.true;
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWithExactly(val, String);
        expect(validator.validate).to.be.calledWithExactly(val, Number);
      });
    });

    context('invalid values', () => {
      it('throws NotAMemberError on failed validation result of value not matching any of provided expectations delegated to validator and ensures that expectation is readable', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 'my-string';
        const oneOf = new OneOf(String, Number);
        const error = new ValidationError('my-error');
        validator.validate.withArgs(val, String).throws(error);
        validator.validate.withArgs(val, Number).throws(error);

        const oneOfStr = inspect(oneOf);
        describer.describe.withArgs(oneOf).returns(oneOfStr);

        expect(() => oneOfValidator.validate(val, oneOf, validator)).to.throw(
          NotAMemberError,
          'Expected undefined to be one of: [Function: String], [Function: Number]'
        );
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWithExactly(val, String);
        expect(validator.validate).to.be.calledWithExactly(val, Number);
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWithExactly(oneOf);
        expect(describer.describe).to.be.calledWithExactly(val);
      });
    });
  });
});
