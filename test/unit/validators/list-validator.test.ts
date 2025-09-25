import { expect, use } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { inspect } from 'util';
import { ListValidator } from '../../../src/validators/list-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import { List } from '../../../src/patterns/list';
import {
  InvalidTypeError,
  UnmatchedTypeError,
  ValidationError,
} from '../../../src/errors';

use(sinonChai);

describe(`ListValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(ListValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of List', () => {
        const listValidator = new ListValidator();
        expect(listValidator.canValidate(new List([]))).to.be.true;
      });
    });

    context('implicit expectation', () => {
      context('valid', () => {
        it('returns true for Array constructor expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate(Array)).to.be.true;
        });

        it('returns true for empty array expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([])).to.be.true;
        });

        it('returns true for array with single value expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([String])).to.be.true;
        });
      });

      context('invalid', () => {
        it('returns false for non-array expectations', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate({})).to.be.false;
        });

        it('returns false for array with more then one value', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([String, Number])).to.be.false;
        });
      });
    });
  });

  describe('validation', () => {
    it(`throws InvalidTypeError when provided value is not an array`, () => {
      const listValidator = new ListValidator();
      const value = {
        key: 'value',
      };
      const valueStr = inspect(value);

      describer.describe.returns(valueStr);

      expect(() =>
        listValidator.validate(value, new List(Array), validator)
      ).to.throw(InvalidTypeError, `Expected ${valueStr} to be an Array`);
      expect(describer.describe).to.be.called;
      expect(describer.describe).to.be.calledWith(value);
    });

    it('ensures that expectation is pulled from List instance correctly', () => {
      const listValidator = new ListValidator();
      const value = [String];
      const expectation = new List(Array);

      expect(listValidator.validate(value, expectation, validator)).to.be.true;
    });

    context('expectation requires value to be just an array', () => {
      it('returns true for any value as an array if provided expectation is Array constructor', () => {
        const listValidator = new ListValidator();
        const value = [String];
        const expectation = Array;

        expect(listValidator.validate(value, expectation, validator)).to.be
          .true;
      });

      it('returns true for any value as an array if provided expectation is empty Array instance', () => {
        const listValidator = new ListValidator();
        const value = [String];
        const expectation = [];

        expect(listValidator.validate(value, expectation, validator)).to.be
          .true;
      });
    });

    context('expectation requires value to match', () => {
      it('returns true for value as an array matching provided expectation ', () => {
        const listValidator = new ListValidator();
        const value = ['first', 'second'];
        const expectation = [String];

        validator.validate.withArgs('first', String).returns(true);
        validator.validate.withArgs('second', String).returns(true);

        expect(listValidator.validate(value, expectation, validator)).to.be
          .true;
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWith('first', String);
        expect(validator.validate).to.be.calledWith('second', String);
      });

      it('re-throws ValidationError for value as an array that does not match expectation ', () => {
        const error: ValidationError = new UnmatchedTypeError(
          'Expected Number(2) to be a String'
        );
        validator.validate.withArgs('first').returns(true);
        validator.validate.withArgs(2).throws(error);

        const listValidator = new ListValidator();
        const value = ['first', 2];
        const valueStr = inspect(value);
        const expectation = [String];
        const expectationStr = inspect(expectation);

        describer.describe.withArgs(value).returns(valueStr);
        describer.describe.withArgs(expectation).returns(expectationStr);

        expect(() =>
          listValidator.validate(value, expectation, validator)
        ).to.throw(
          UnmatchedTypeError,
          `Expected ${valueStr} to be matching an ${expectationStr}`
        );
      });
    });
  });
});
