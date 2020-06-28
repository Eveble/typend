import chai, { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import sinonChai from 'sinon-chai';
import { inspect } from 'util';
import { EqualsValidator } from '../../../src/validators/equals-validator';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { Equals } from '../../../src/patterns/equals';
import { InvalidTypeError, UnequalValueError } from '../../../src/errors';

chai.use(sinonChai);

describe(`EqualsValidator`, function () {
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

  class IsSameClass {
    public value: string;

    constructor(value: string) {
      this.value = value;
    }

    isSame(otherClass: any): boolean {
      return this.value === otherClass.value;
    }
  }

  class EqualsClass {
    public value: string;

    constructor(value: string) {
      this.value = value;
    }

    equals(otherClass: any): boolean {
      return this.value === otherClass.value;
    }
  }

  class MyError extends Error {}

  /*
    TEST HELPERS
  */
  type Matches = [any, any][];

  function validateWithStrictEquality(matches: Matches): void {
    const eqValidator = new EqualsValidator();
    for (const element of matches) {
      const [val, expectation] = element;
      const valStr = inspect(val);
      const expectationStr = inspect(expectation);
      const expectedStr = `Expected ${valStr} to be equal to ${expectationStr}`;

      describer.describe.withArgs(val).returns(valStr);
      describer.describe.withArgs(expectation).returns(expectationStr);

      expect(eqValidator.validate(val, expectation), expectedStr).to.be.true;
    }
  }

  it(`extends PatternValidator`, () => {
    expect(EqualsValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Equals', () => {
        const eqValidator = new EqualsValidator();
        expect(eqValidator.canValidate(new Equals('my-string'))).to.be.true;
      });
    });

    context('implicit expectation', () => {
      context('valid', () => {
        it('returns true for valid expectation as instances of equality-comparable types', () => {
          const VALID_EXPECTATIONS: any[] = [
            // Native types
            undefined,
            null,
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
            // Comparable class instances
            new IsSameClass('test'), // isSame method
            new EqualsClass('test'), // equals method
          ];
          const eqValidator = new EqualsValidator();
          for (const expectation of VALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              eqValidator.canValidate(expectation),
              `Expected expectation '${expectationStr}' to be valid for equality validation`
            ).to.true;
          }
        });

        it('returns true for valid expectation as error instances ', () => {
          const VALID_EXPECTATIONS: any[] = [
            // Errors by message & constructor type checking
            new Error(),
            new EvalError(),
            new RangeError(),
            new ReferenceError(),
            new SyntaxError(),
            new TypeError(),
            new URIError(),
            new MyError('my-message'),
          ];
          const eqValidator = new EqualsValidator();
          for (const expectation of VALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              eqValidator.canValidate(expectation),
              `Expected expectation '${expectationStr}' to be valid for equality validation`
            ).to.true;
          }
        });

        it('returns true for valid expectation as instances of reference-based types', () => {
          const VALID_EXPECTATIONS: any[] = [
            // Non-comparable class instances that will be evaluated by reference match
            new ParentClass('test'),
            new ChildClass('test'),
          ];
          const eqValidator = new EqualsValidator();
          for (const expectation of VALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              eqValidator.canValidate(expectation),
              `Expected expectation '${expectationStr}' to be valid for reference validation`
            ).to.true;
          }
        });

        it('returns true for constructor expectation(for comparison by reference equality in memory)', () => {
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
            // Class constructors
            ParentClass,
            ChildClass,
            IsSameClass,
            EqualsClass,
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
          const eqValidator = new EqualsValidator();
          for (const expectation of VALID_EXPECTATIONS) {
            const expectationStr = inspect(expectation);
            describer.describe.returns(expectationStr);
            expect(
              eqValidator.canValidate(expectation),
              `Expected expectation '${expectationStr}' to be valid for reference validation`
            ).to.true;
          }
        });
      });

      context('invalid', () => {
        it('returns false for array expectation', () => {
          const eqValidator = new EqualsValidator();
          expect(eqValidator.canValidate([])).to.be.false;
        });

        it('returns false for plain object expectation', () => {
          const eqValidator = new EqualsValidator();
          expect(eqValidator.canValidate({})).to.be.false;
          expect(eqValidator.canValidate({ key: 'value' })).to.be.false;
        });
      });
    });
  });

  describe('validation', () => {
    it(`throws InvalidTypeError when provided value is an object`, () => {
      const eqValidator = new EqualsValidator();
      const value = {
        key: 'value',
      };
      const expectation = new Equals(2);

      describer.describe.withArgs(value).returns(inspect(value));
      describer.describe.withArgs(expectation).returns(inspect(expectation));

      expect(() => eqValidator.validate(value, expectation)).to.throw(
        InvalidTypeError,
        `Expected { key: 'value' } to not be a plain Object`
      );
      expect(describer.describe).to.be.calledOnce;
      expect(describer.describe).to.be.calledWith(value);
    });

    it(`throws InvalidTypeError when provided value is an array`, () => {
      const eqValidator = new EqualsValidator();
      const value = ['value'];
      const expectation = new Equals(2);

      describer.describe.withArgs(value).returns(inspect(value));
      describer.describe.withArgs(expectation).returns(inspect(expectation));

      expect(() => eqValidator.validate(value, expectation)).to.throw(
        InvalidTypeError,
        `Expected [ 'value' ] to not be an Array`
      );
      expect(describer.describe).to.be.calledOnce;
      expect(describer.describe).to.be.calledWith(value);
    });

    it('ensures that expectation is pulled from Equals pattern instance instance correctly', () => {
      const eqValidator = new EqualsValidator();
      const value = 'value';
      const equals = new Equals('value');

      expect(eqValidator.validate(value, equals)).to.be.true;
    });

    context('valid values', () => {
      it('returns true for nil equality check', () => {
        const matches: Matches = [
          [undefined, undefined],
          [null, null],
        ];

        validateWithStrictEquality(matches);
      });

      it('returns true for regexp matching pattern', () => {
        const matches: Matches = [
          ['matches', new RegExp(/matches/)],
          ['matches', /matches/],
        ];

        validateWithStrictEquality(matches);
      });

      it('returns true for error instances matching message and same constructor', () => {
        const matches: Matches = [
          [new Error('my-error'), new Error('my-error')],
          [new MyError('my-error'), new MyError('my-error')],
        ];

        validateWithStrictEquality(matches);
      });

      it(`returns true for class instances with 'isSame' method`, () => {
        const matches: Matches = [
          [new IsSameClass('my-value'), new IsSameClass('my-value')],
        ];

        validateWithStrictEquality(matches);
      });

      it(`returns true for class instances with 'equals' method`, () => {
        const matches: Matches = [
          [new EqualsClass('my-value'), new EqualsClass('my-value')],
        ];

        validateWithStrictEquality(matches);
      });

      it(`returns true for types implementing 'valueOf' method`, () => {
        const matches: Matches = [
          [
            new Date('2000-01-01T00:00:00.000Z'),
            new Date('2000-01-01T00:00:00.000Z'),
          ],
        ];

        validateWithStrictEquality(matches);
      });

      it('returns true if native type instances matches expectation(strict equality check)', () => {
        const matches: Matches = [
          // String literal
          ['abcd', 'abcd'],
          // Boolean literal
          [true, true],
          [false, false],
          // Numbers
          [1, 1],
          [-1, -1],
          [0, 0],
          [Math.PI, Math.PI],
        ];

        validateWithStrictEquality(matches);
      });

      it('returns true for constructors matched by reference in memory(strict equality check)', () => {
        const matches: Matches = [
          // Class constructors for reference based equality validation
          [ParentClass, ParentClass],
          [ChildClass, ChildClass],
          // Error constructors for reference based equality validation
          [Error, Error],
          [EvalError, EvalError],
          [RangeError, RangeError],
          [ReferenceError, ReferenceError],
          [SyntaxError, SyntaxError],
          [TypeError, TypeError],
          [URIError, URIError],
          [MyError, MyError],
        ];

        validateWithStrictEquality(matches);
      });
    });

    context('invalid values', () => {
      it('throws UnequalValueError for regexp not matching expectation', () => {
        const eqValidator = new EqualsValidator();
        const value = 'mismatch';
        const expectation = new RegExp(/matches/);

        describer.describe.withArgs(value).returns(inspect(value));
        describer.describe.withArgs(expectation).returns(inspect(expectation));

        expect(() => eqValidator.validate(value, expectation)).to.throw(
          UnequalValueError,
          `Expected 'mismatch' to match /matches/`
        );
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWith(value);
        expect(describer.describe).to.be.calledWith(expectation);
      });

      it('throws UnequalValueError for error instances that are not matching expectation by message or constructor', () => {
        const matches: [any, any][] = [
          [new Error('my-error'), Error], // reference check, use PatternValidator for type validation
          [new MyError('my-error'), MyError], // reference check, use PatternValidator for type validation
          [new MyError('my-error'), new Error('my-error')],
          [new MyError('my-error'), new MyError('my-other-error')],
        ];

        const eqValidator = new EqualsValidator();
        for (const element of matches) {
          const [val, expectation] = element;
          const valStr = inspect(val);
          const expectationStr = inspect(expectation);
          const expectedStr = `Expected ${valStr} to not be equal ${expectationStr}`;

          describer.describe.withArgs(val).returns(valStr);
          describer.describe.withArgs(expectation).returns(expectationStr);

          expect(
            () => eqValidator.validate(val, expectation),
            expectedStr
          ).to.throw(
            UnequalValueError,
            `Expected ${valStr} to be equal to ${expectationStr}`
          );
        }
      });

      it(`throws UnequalValueError for instances with 'isSame' method not matching expectation`, () => {
        const eqValidator = new EqualsValidator();
        const value = new IsSameClass('value');
        const expectation = new IsSameClass('other-value');

        describer.describe.withArgs(value).returns(inspect(value));
        describer.describe.withArgs(expectation).returns(inspect(expectation));

        expect(() => eqValidator.validate(value, expectation)).to.throw(
          UnequalValueError,
          `Expected IsSameClass { value: 'value' } to pass IsSameClass { value: 'other-value' } is same evaluation`
        );
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWith(value);
        expect(describer.describe).to.be.calledWith(expectation);
      });

      it(`throws UnequalValueError for instances with 'equals' method not matching expectation`, () => {
        const eqValidator = new EqualsValidator();
        const value = new EqualsClass('value');
        const expectation = new EqualsClass('other-value');

        describer.describe.withArgs(value).returns(inspect(value));
        describer.describe.withArgs(expectation).returns(inspect(expectation));

        expect(() => eqValidator.validate(value, expectation)).to.throw(
          UnequalValueError,
          `Expected EqualsClass { value: 'value' } to pass EqualsClass { value: 'other-value' } equality evaluation`
        );
        expect(describer.describe).to.be.calledTwice;
        expect(describer.describe).to.be.calledWith(value);
        expect(describer.describe).to.be.calledWith(expectation);
      });

      it(`throws UnequalValueError for instances with 'valueOf' method not matching expectation`, () => {
        const matches: [any, any][] = [
          [
            new Date('2000-01-01T00:00:00.000Z'),
            new Date('2111-01-01T00:00:00.000Z'),
          ],
        ];

        const eqValidator = new EqualsValidator();
        for (const element of matches) {
          const [val, expectation] = element;
          const valStr = inspect(val);
          const expectationStr = inspect(expectation);
          const expectedStr = `Expected ${valStr} value to be equal to ${expectationStr}`;

          describer.describe.withArgs(val).returns(valStr);
          describer.describe.withArgs(expectation).returns(expectationStr);

          expect(
            () => eqValidator.validate(val, expectation),
            expectedStr
          ).to.throw(
            UnequalValueError,
            `Expected ${valStr} value to be equal to ${expectationStr}`
          );
        }
      });

      it('throws UnequalValueError for native type instances not matching expectation', () => {
        const matches: [any, any][] = [
          [null, 0],
          [null, undefined],
          [undefined, null],
          ['xyz', 'abc'],
          [2, '2'],
          [-1, 1],
          [false, true],
          [true, false],
          [Symbol('key'), Symbol],
          [Symbol('key'), Symbol('key')], // Symbols with same Describings are never equal
          [Symbol('key'), Symbol('other-key')],
          [new Map([['key', 'value']]), new Map([['key', 'value']])],
        ];

        const eqValidator = new EqualsValidator();
        for (const element of matches) {
          const [val, expectation] = element;
          const valStr = inspect(val);
          const expectationStr = inspect(expectation);
          const expectedStr = `Expected ${valStr} to be equal to ${expectationStr}`;

          describer.describe.withArgs(val).returns(valStr);
          describer.describe.withArgs(expectation).returns(expectationStr);
          expect(
            () => eqValidator.validate(val, expectation),
            expectedStr
          ).to.throw(
            UnequalValueError,
            `Expected ${valStr} to be equal to ${expectationStr}`
          );
        }
      });

      it('throws UnequalValueError for constructor not matching references', () => {
        class MyString {}

        const matches: [any, any][] = [
          [String, MyString],
          [Number, Number(2)],
        ];

        const eqValidator = new EqualsValidator();
        for (const element of matches) {
          const [val, expectation] = element;
          const valStr = inspect(val);
          const expectationStr = inspect(expectation);
          const expectedStr = `Expected ${valStr} to be equal to ${expectationStr}`;

          describer.describe.withArgs(val).returns(valStr);
          describer.describe.withArgs(expectation).returns(expectationStr);

          expect(
            () => eqValidator.validate(val, expectation),
            expectedStr
          ).to.throw(
            UnequalValueError,
            `Expected ${valStr} to be equal to ${expectationStr}`
          );
        }
      });
    });
  });
});
