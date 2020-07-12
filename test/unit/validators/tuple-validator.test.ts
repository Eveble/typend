import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Tuple } from '../../../src/patterns/tuple';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { TupleValidator } from '../../../src/validators/tuple-validator';
import {
  InvalidTypeError,
  NotAMemberError,
  ValidationError,
} from '../../../src/errors';
import { Optional } from '../../../src/patterns/optional';

chai.use(sinonChai);

describe(`TupleValidator`, function () {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(TupleValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Tuple', () => {
        const tupleValidator = new TupleValidator();
        expect(tupleValidator.canValidate(new Tuple(String, Number))).to.be
          .true;
      });
    });

    context('implicit expectation', () => {
      context('valid', () => {
        it('returns true for array with single value expectation', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([String])).to.be.true;
        });

        it('returns true for array with two or more values expectation', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([String, Number])).to.be.true;
        });
      });

      context('invalid', () => {
        it('returns false for non-array expectations', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate({})).to.be.false;
          expect(tupleValidator.canValidate(true)).to.be.false;
          expect(tupleValidator.canValidate(false)).to.be.false;
          expect(tupleValidator.canValidate(undefined)).to.be.false;
          expect(tupleValidator.canValidate(null)).to.be.false;
        });

        it('returns false for empty array instance', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([])).to.be.false;
        });
      });
    });
  });

  describe('validation', () => {
    it(`throws InvalidTypeError when provided value is not an array`, () => {
      const tupleValidator = new TupleValidator();
      const value = {
        key: 'value',
      };
      const valueStr = inspect(value);

      describer.describe.returns(valueStr);

      expect(() =>
        tupleValidator.validate(value, new Tuple(String), validator)
      ).to.throw(InvalidTypeError, `Expected ${valueStr} to be an Array`);
      expect(describer.describe).to.be.called;
      expect(describer.describe).to.be.calledWith(value);
    });

    context('valid values', () => {
      it(`iterates through each expectation item and validates them against validator`, () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 2];
        const tuple = new Tuple(String, Number);
        validator.validate.withArgs('my-string', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(tupleValidator.validate(val, tuple, validator)).to.be.true;
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWithExactly('my-string', String);
        expect(validator.validate).to.be.calledWithExactly(2, Number);
      });
    });

    context('invalid values', () => {
      it('throws NotAMemberError on failed validation result of value not matching one of provided expectations delegated to validator', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string'];
        const tuple = new Tuple(Number);
        const error = new ValidationError('my-error');
        validator.validate.withArgs('my-string', Number).throws(error);

        const tupleStr = inspect(tuple);
        describer.describe.withArgs(tuple).returns(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).to.throw(
          NotAMemberError,
          `Expected undefined to be matching an ${tupleStr}`
        );
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWithExactly('my-string', Number);
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWithExactly(tuple);
        expect(describer.describe).to.be.calledWithExactly(val);
      });

      it('throws NotAMemberError when there are more values in tuple then expected ones', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 1234];
        const tuple = new Tuple(String);

        const error = new ValidationError('my-error');
        validator.validate.withArgs('my-string', String).returns(true);
        validator.validate.withArgs(1234, undefined).throws(error);

        const valStr = inspect(val);
        const tupleStr = inspect(tuple);
        describer.describe.withArgs(val).returns(valStr);
        describer.describe.withArgs(tuple).returns(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).to.throw(
          NotAMemberError,
          `Expected ${valStr} to be matching an ${tupleStr}`
        );
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWithExactly('my-string', String);
        expect(validator.validate).to.be.calledWithExactly(1234, undefined);
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWithExactly(tuple);
        expect(describer.describe).to.be.calledWithExactly(val);
      });

      it('throws NotAMemberError when there are less values in tuple then expected ones', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string'];
        const tuple = new Tuple(String, Number);

        const error = new ValidationError('my-error');
        validator.validate.withArgs('my-string', String).returns(true);
        validator.validate.withArgs(undefined, Number).throws(error);

        const valStr = inspect(val);
        const tupleStr = inspect(tuple);
        describer.describe.withArgs(val).returns(valStr);
        describer.describe.withArgs(tuple).returns(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).to.throw(
          NotAMemberError,
          `Expected ${valStr} to be matching an ${tupleStr}`
        );
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWithExactly('my-string', String);
        expect(validator.validate).to.be.calledWithExactly(undefined, Number);
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWithExactly(tuple);
        expect(describer.describe).to.be.calledWithExactly(val);
      });

      it('does not throw NotAMemberError when there are less values in tuple then expected ones if they are optional', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 2];
        const tuple = new Tuple(String, Number, new Optional(Boolean));

        validator.validate.withArgs('my-string', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);
        validator.validate
          .withArgs(undefined, new Optional(Boolean))
          .returns(true);

        expect(() =>
          tupleValidator.validate(val, tuple, validator)
        ).to.not.throw(NotAMemberError);

        expect(validator.validate).to.be.calledThrice;
        expect(validator.validate).to.be.calledWithExactly('my-string', String);
        expect(validator.validate).to.be.calledWithExactly(2, Number);
        expect(validator.validate).to.be.calledWithExactly(
          undefined,
          new Optional(Boolean)
        );
        expect(describer.describe).to.not.be.called;
      });
    });
  });
});
