import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { CollectionIncluding } from '../../../src/patterns/collection-including';
import { CollectionIncludingValidator } from '../../../src/validators/collection-including-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import {
  InvalidTypeError,
  UnequalValueError,
  UnexpectedKeyError,
} from '../../../src/errors';
import { types } from '../../../src/types';

chai.use(sinonChai);

describe(`CollectionIncludingValidator`, function () {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  class MyClass {
    constructor(props: Record<string, any>) {
      Object.assign(this, props);
    }
  }

  it(`extends PatternValidator`, () => {
    expect(CollectionIncludingValidator.prototype).to.instanceof(
      PatternValidator
    );
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of CollectionIncluding', () => {
        const collIncValidator = new CollectionIncludingValidator();
        expect(collIncValidator.canValidate(new CollectionIncluding({}))).to.be
          .true;
      });
    });

    context('implicit expectation', () => {
      it('returns true for expectation as plain object in loose mode', () => {
        const collIncValidator = new CollectionIncludingValidator();
        expect(collIncValidator.canValidate({}, false)).to.be.true;
      });

      it('returns false for expectation as plain object in strict mode', () => {
        const collIncValidator = new CollectionIncludingValidator();
        expect(collIncValidator.canValidate({}, true)).to.be.false;
      });

      it('returns false for any other not matching expectation', () => {
        const collIncValidator = new CollectionIncludingValidator();
        expect(collIncValidator.canValidate(undefined)).to.be.false;
        expect(collIncValidator.canValidate(null)).to.be.false;
        expect(collIncValidator.canValidate(true)).to.be.false;
        expect(collIncValidator.canValidate(false)).to.be.false;
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not an plain object`, () => {
      const collIncValidator = new CollectionIncludingValidator();

      const val = new MyClass({
        key: 'value',
      });
      const expectation = {
        key: 'value',
      };
      const valStr = inspect(val);
      describer.describe.returns(valStr);

      expect(() =>
        collIncValidator.validate(val, expectation, validator)
      ).to.throw(InvalidTypeError, `Expected ${valStr} to be an Object`);
      expect(describer.describe).to.be.called;
      expect(describer.describe).to.be.calledWith(val);
    });

    context('valid values', () => {
      it(`iterates through each expected object entries and validates them against validator`, () => {
        const collIncValidator = new CollectionIncludingValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = {
          first: String,
          second: Number,
        };
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(collIncValidator.validate(val, expectation, validator)).to.be
          .true;
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWith('value', String);
        expect(validator.validate).to.be.calledWith(2, Number);
      });

      it(`returns true for object value with other arbitrary keys and values`, () => {
        const collIncValidator = new CollectionIncludingValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = {
          first: String,
        };
        const valStr = inspect(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(2, undefined)
          .throws(
            new UnequalValueError(`Expected Number(2) to be a undefined`)
          );

        expect(collIncValidator.validate(val, expectation, validator)).to.be
          .true;
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWith('value', String);
      });

      it(`returns true for nested object value with other arbitrary keys and values`, () => {
        const collIncValidator = new CollectionIncludingValidator();

        const val = {
          first: 'value',
          second: {
            a: 'a-value',
            unexpected: 'unexpected-value',
          },
        };
        const expectation = {
          first: String,
          second: {
            a: 'a-value',
          },
        };
        const valStr = inspect(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(
            { a: 'a-value', unexpected: 'unexpected-value' },
            { a: 'a-value' }
          )
          .throws(
            new UnexpectedKeyError(
              `Unexpected key 'unexpected' in {"a":"a-value","unexpected":"unexpected-value"}`
            )
          );

        expect(collIncValidator.validate(val, expectation, validator)).to.be
          .true;
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWith('value', String);
      });
    });

    context('invalid values', () => {
      it(`pass-through errors from type validator validation if provided object value contain nested properties that does not match expected one`, () => {
        const collIncValidator = new CollectionIncludingValidator();

        const expectation = {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'value',
            },
          },
        };
        const val = {
          foo: {
            bar: {
              a: 'a-value',
              b: 'b-invalid-not-a-number',
            },
            baz: {
              c: 'c-value',
            },
          },
        };
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);

        validator.validate.withArgs('a-value', String).returns(true);
        validator.validate
          .withArgs('b-invalid-not-a-number', Number)
          .throws(
            new UnequalValueError(
              `Expected Number, got String("invalid-should-be-number")`
            )
          );
        validator.validate.withArgs('c-value', String).returns(true);

        expect(() =>
          collIncValidator.validate(val, expectation, validator)
        ).to.throw(
          UnequalValueError,
          `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
        );
        expect(validator.validate).to.be.calledWith('a-value', String);
        expect(validator.validate).to.be.calledWith(
          'b-invalid-not-a-number',
          Number
        );
      });
    });
  });
});
