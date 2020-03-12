import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Class } from '../../../src/patterns/class';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { ClassValidator } from '../../../src/validators/class-validator';
import {
  UnequalValueError,
  InvalidTypeError,
  UnexpectedKeyError,
  ValidationError,
  UnmatchedTypeError,
} from '../../../src/errors';

chai.use(sinonChai);

describe(`ClassValidator`, function() {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  class MyClass {
    key: string;

    constructor(props: Record<string, any>) {
      Object.assign(this, props);
    }
  }

  it(`extends PatternValidator`, () => {
    expect(ClassValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Class', () => {
        const classValidator = new ClassValidator();
        expect(classValidator.canValidate(new Class(MyClass, { key: String })))
          .to.be.true;
      });
    });

    context('implicit expectation', () => {
      it('does not support implicit expectations', () => {
        const classValidator = new ClassValidator();
        expect(classValidator.canValidate(undefined)).to.be.false;
        expect(classValidator.canValidate(null)).to.be.false;
        expect(classValidator.canValidate(true)).to.be.false;
        expect(classValidator.canValidate(false)).to.be.false;
        expect(classValidator.canValidate({})).to.be.false;
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not a class instance`, () => {
      const classValidator = new ClassValidator();

      const val = {
        key: 'value',
      };
      const expectation = new Class(MyClass, {
        key: String,
      });
      const valStr = inspect(val);
      describer.describe.returns(valStr);

      expect(() =>
        classValidator.validate(val, expectation, validator)
      ).to.throw(
        InvalidTypeError,
        `Expected ${valStr} to be an instance of MyClass`
      );
      expect(describer.describe).to.be.called;
      expect(describer.describe).to.be.calledWith(val);
    });

    it('ensures that properties are pulled from Class pattern instance correctly', () => {
      const classValidator = new ClassValidator();
      const value = new MyClass({ key: 'value' });
      const expectation = new Class(MyClass, { key: String });

      expect(classValidator.validate(value, expectation, validator)).to.be.true;
    });

    context('valid values', () => {
      it(`iterates through each expected properties entries and validates them against validator`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          first: string;

          second: number;

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const val = new MyOtherClass({
          first: 'value',
          second: 2,
        });
        const expectation = new Class(MyOtherClass, {
          first: String,
          second: Number,
        });
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(classValidator.validate(val, expectation, validator)).to.be.true;
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWith('value', String);
        expect(validator.validate).to.be.calledWith(2, Number);
      });
    });

    context('invalid values', () => {
      it(`throws UnexpectedKeyError if provided value contain keys not listed on expected properties`, () => {
        const classValidator = new ClassValidator();

        const val = new MyClass({
          first: 'value',
          second: 2,
        });
        const expectation = new Class(MyClass, {
          first: String,
        });
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(2, undefined)
          .throws(
            new UnequalValueError(`Expected Number(2) to be a undefined`)
          );

        expect(() =>
          classValidator.validate(val, expectation, validator)
        ).to.throw(UnexpectedKeyError, `Unexpected key 'second' in ${valStr}`);
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWith('value', String);
      });

      it(`pass-through errors from type validator validation if provided instance contain nested properties that does not match expected ones`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          foo: {
            bar: {
              a: string;
              b: number;
            };
            baz: {
              c: 'value';
            };
          };

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const expectation = new Class(MyOtherClass, {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'value',
            },
          },
        });
        const val = new MyOtherClass({
          foo: {
            bar: {
              a: 'a-value',
              b: 'b-invalid-not-a-number',
            },
            baz: {
              c: 'c-value',
            },
          },
        });
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
          classValidator.validate(val, expectation, validator)
        ).to.throw(
          UnequalValueError,
          `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
        );
        expect(validator.validate).to.be.calledTwice;
        expect(validator.validate).to.be.calledWith('a-value', String);
        expect(validator.validate).to.be.calledWith(
          'b-invalid-not-a-number',
          Number
        );
      });

      it(`throws UnexpectedKeyError if provided value contain nested keys not listed in the expected properties`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          foo: {
            foo: {
              bar: {
                a: string;
                b: number;
              };
              baz: {
                c: 'c-value';
              };
            };
          };

          constructor(props: Record<string, any>) {
            Object.assign(this, props);
          }
        }

        const props = new Class(MyOtherClass, {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'c-value',
            },
          },
        });

        const val = new MyOtherClass({
          foo: {
            bar: {
              a: 'a-value',
              b: 2,
            },
            baz: {
              c: 'c-value',
              unknown: 'unknown',
            },
          },
        });
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);

        validator.validate.withArgs('a-value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);
        validator.validate.withArgs('c-value', String).returns(true);
        validator.validate
          .withArgs(
            {
              c: 'c-value',
              unknown: 'unknown',
            },
            {
              c: 'c-value',
            }
          )
          .throws(
            new UnexpectedKeyError(
              `Unexpected key unknown in {"c":"value","unknown":"unknown"}`
            )
          );

        expect(() => classValidator.validate(val, props, validator)).to.throw(
          ValidationError,
          `(Key 'foo.baz': Unexpected key unknown in {"c":"value","unknown":"unknown"} in {"foo":{"bar":{"a":"a-value","b":2},"baz":{"c":"c-value","unknown":"unknown"}}})`
        );
        expect(validator.validate).to.be.calledThrice;
        expect(validator.validate).to.be.calledWith('a-value', String);
        expect(validator.validate).to.be.calledWith(2, Number);
        expect(validator.validate).to.be.calledWith(
          {
            c: 'c-value',
            unknown: 'unknown',
          },
          {
            c: 'c-value',
          }
        );
      });

      it(`throws UnmatchedTypeError if provided value does not match expected type`, () => {
        const classValidator = new ClassValidator();

        class MyOtherClass {
          first: string;
        }

        const val = new MyClass({
          first: 'value',
        });
        const expectation = new Class(MyOtherClass, {
          first: String,
        });
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);

        expect(() =>
          classValidator.validate(val, expectation, validator)
        ).to.throw(
          UnmatchedTypeError,
          `Expected ${valStr} to be a instance of MyOtherClass`
        );
        expect(validator.validate).to.be.calledOnce;
        expect(validator.validate).to.be.calledWith('value', String);
      });
    });
  });
});
