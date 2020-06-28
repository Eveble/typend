import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { inspect } from 'util';
import sinon from 'sinon';
import { InstanceOfValidator } from '../../../src/validators/instance-of-validator';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { UnmatchedTypeError, InvalidTypeError } from '../../../src/errors';

chai.use(sinonChai);

describe(`InstanceOfValidator`, function () {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  /*
    TEST DATA
  */
  class ParentClass {
    public value: string;

    constructor(value: string) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}
  /*
    TEST HELPERS
  */
  type Matches = [any, any][];

  it(`extends PatternValidator`, () => {
    expect(InstanceOfValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of InstanceOf', () => {
        const instanceOfValidator = new InstanceOfValidator();
        expect(instanceOfValidator.canValidate(new InstanceOf(String))).to.be
          .true;
      });
    });

    context('implicit expectation', () => {
      context('valid', () => {
        it('returns true for valid expectation as nil', () => {
          const instanceOfValidator = new InstanceOfValidator();
          expect(instanceOfValidator.canValidate(undefined)).to.be.true;
          expect(instanceOfValidator.canValidate(null)).to.be.true;
        });

        it('returns true for valid expectation as constructor types', () => {
          const VALID_EXPECTATIONS: any[] = [
            // Native types
            String,
            Boolean,
            Date,
            Number,
            RegExp,
            Function,
            Symbol,
            Map,
            Error,
            Object,
            Array,
            undefined,
            null,
            // Class constructors
            ParentClass,
            ChildClass,
            // Errors
            Error,
            EvalError,
            RangeError,
            ReferenceError,
            SyntaxError,
            TypeError,
            URIError,
            MyError,
          ];

          const instanceOfValidator = new InstanceOfValidator();
          for (const expectation of VALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              instanceOfValidator.canValidate(expectation),
              `Expected expectation ${expectationStr} to be valid`
            ).to.true;
          }
        });

        it('returns true for valid expectation as sinon clock date', () => {
          const clock = sinon.useFakeTimers();
          const instanceOfValidator = new InstanceOfValidator();
          const expectationStr = 'ClockDate(sinon)';
          describer.describe.returns(expectationStr);
          expect(
            instanceOfValidator.canValidate(Date),
            `Expected expectation ${expectationStr} to be valid`
          ).to.true;
          clock.restore();
        });
      });

      context('invalid', () => {
        it('returns false for array instance expectatios', () => {
          const instanceOfValidator = new InstanceOfValidator();
          const expectation = [];
          const expectationStr = inspect(expectation);
          describer.describe.returns(expectationStr);

          expect(
            instanceOfValidator.canValidate(expectation),
            `Expected expectation ${expectationStr} to be invalid`
          ).to.false;
        });

        it('returns false for non-constructor expectations', () => {
          const INVALID_EXPECTATIONS: any[] = [
            // String literal
            'abcd',
            // Boolean literal
            true,
            false,
            // Date
            new Date('2017-02-06T20:43:13.464Z'),
            // Number related
            Infinity,
            -Infinity,
            Math.PI,
            -Math.PI,
            Number.MAX_VALUE,
            -Number.MAX_VALUE,
            1,
            0,
            -1,
            -2147483648,
            2147483647,
            // Regexp
            new RegExp(/fail/),
            /fail/,
            // Symbol
            Symbol('key'),
            // Map
            new Map([['key', 'value']]),
            // Errors
            new Error(),
            new EvalError(),
            new RangeError(),
            new ReferenceError(),
            new SyntaxError(),
            new TypeError(),
            new URIError(),
            new MyError('my-message'),
          ];

          const instanceOfValidator = new InstanceOfValidator();
          for (const expectation of INVALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              instanceOfValidator.canValidate(expectation),
              `Expected expectation ${expectationStr} to be invalid`
            ).to.false;
          }
        });
      });
    });
  });

  describe('validation', () => {
    it('throws InvalidTypeError for array expectations', () => {
      const instanceOfValidator = new InstanceOfValidator();
      const value = [];
      const valueStr = inspect(value);
      const expectation = Array;
      const expectationStr = inspect(expectation);
      describer.describe.withArgs(value).returns(valueStr);
      describer.describe.withArgs(expectation).returns(expectationStr);

      expect(() => instanceOfValidator.validate(value, expectation)).to.throw(
        InvalidTypeError,
        `InstanceOfValidator can't handle Array values, got []`
      );
    });

    it('ensures that expectation is pulled from InstanceOf instance correctly', () => {
      const instanceOfValidator = new InstanceOfValidator();
      const value = 'value';
      const instanceOf = new InstanceOf(String);

      expect(instanceOfValidator.validate(value, instanceOf)).to.be.true;
    });

    context('valid values', () => {
      it('returns true for valid values as nil', () => {
        const instanceOfValidator = new InstanceOfValidator();
        expect(instanceOfValidator.validate(undefined, undefined)).to.be.true;
        expect(instanceOfValidator.validate(null, null)).to.be.true;
      });

      it('returns true for valid values matching constructor types', () => {
        const matches: Matches = [
          // String literal
          ['abcd', String],
          // Boolean literal
          [true, Boolean],
          [false, Boolean],
          // Date
          [new Date('2017-02-06T20:43:13.464Z'), Date],
          // Number related
          [Infinity, Number],
          [-Infinity, Number],
          [Math.PI, Number],
          [-Math.PI, Number],
          [Number.MAX_VALUE, Number],
          [-Number.MAX_VALUE, Number],
          [1, Number],
          [0, Number],
          [-1, Number],
          [-1, Number],
          [-2147483648, Number],
          [2147483647, Number],
          // Regexp
          [new RegExp(/fail/), RegExp],
          [/fail/, RegExp],
          // Symbol
          [Symbol('key'), Symbol],
          // Map
          [new Map([['key', 'value']]), Map],
          // Comparable class instances
          [new ParentClass('value'), ParentClass],
          [new ChildClass('value'), ChildClass],
          // Errors
          [new Error(), Error],
          [new EvalError(), EvalError],
          [new RangeError(), RangeError],
          [new ReferenceError(), ReferenceError],
          [new SyntaxError(), SyntaxError],
          [new TypeError(), TypeError],
          [new URIError(), URIError],
          [new MyError('my-message'), MyError],
          // Objects
          [{}, Object],
          [{ key: 'value' }, Object],
        ];
        const instanceOfValidator = new InstanceOfValidator();
        for (const element of matches) {
          const [val, expectation] = element;
          const valStr = inspect(val);
          const expectationStr = inspect(expectation);
          const expectedStr = `Expected ${valStr} to be a ${expectationStr}`;

          describer.describe.withArgs(val).returns(valStr);
          describer.describe.withArgs(expectation).returns(expectationStr);

          expect(instanceOfValidator.validate(val, expectation), expectedStr).to
            .be.true;
        }
      });

      it('returns true for valid values matching constructor type by inheritance', () => {
        const instanceOfValidator = new InstanceOfValidator();
        const value = new ChildClass('value');
        const expectation = ParentClass;

        describer.describe.withArgs(value).returns(inspect(value));
        describer.describe.withArgs(expectation).returns(inspect(expectation));

        expect(instanceOfValidator.validate(value, expectation)).to.true;
      });

      it('returns true for valid expectation as sinon clock date', () => {
        const clock = sinon.useFakeTimers();
        const instanceOfValidator = new InstanceOfValidator();
        const expectationStr = 'ClockDate(sinon)';
        describer.describe.returns(expectationStr);

        expect(instanceOfValidator.validate(new Date(), Date)).to.true;
        clock.restore();
      });
    });

    context('invalid values', () => {
      it('throws UnmatchedTypeError for not matching constructor values', () => {
        class FirstClass {}
        class SecondClass {}

        const instanceOfValidator = new InstanceOfValidator();
        const value = FirstClass;
        const expectation = SecondClass;
        const valueStr = inspect(value);
        const expectationStr = inspect(expectation);

        describer.describe.withArgs(value).returns(valueStr);
        describer.describe.withArgs(expectation).returns(expectationStr);

        expect(() => instanceOfValidator.validate(value, expectation)).to.throw(
          UnmatchedTypeError,
          `Expected ${valueStr} to be a ${expectationStr}`
        );
      });

      it('throws UnmatchedTypeError for constructor values with inheritance relation not matching', () => {
        const instanceOfValidator = new InstanceOfValidator();
        const value = ChildClass;
        const expectation = ParentClass;
        const valueStr = inspect(value);
        const expectationStr = inspect(expectation);

        describer.describe.withArgs(value).returns(valueStr);
        describer.describe.withArgs(expectation).returns(expectationStr);

        expect(() => instanceOfValidator.validate(value, expectation)).to.throw(
          UnmatchedTypeError,
          `Expected ${valueStr} to be a ${expectationStr}`
        );
      });

      it('throws UnmatchedTypeError for constructor, that is not a parent of provided child instance as a value', () => {
        class OtherParentClass {}

        const instanceOfValidator = new InstanceOfValidator();
        const value = new ChildClass('value');
        const expectation = OtherParentClass;
        const valueStr = inspect(value);
        const expectationStr = inspect(expectation);

        describer.describe.withArgs(value).returns(valueStr);
        describer.describe.withArgs(expectation).returns(expectationStr);

        expect(() => instanceOfValidator.validate(value, expectation)).to.throw(
          UnmatchedTypeError,
          `Expected ${valueStr} to be a ${expectationStr}`
        );
      });
    });
  });
});
