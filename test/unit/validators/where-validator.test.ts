import { expect } from 'chai';
import { inspect } from 'util';
import { Where } from '../../../src/patterns/where';
import { WhereValidator } from '../../../src/validators/where-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { ValidationError } from '../../../src/errors';

describe(`Where`, () => {
  class ParentClass {
    public value: any;

    constructor(value: any) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}

  it(`extends PatternValidator`, () => {
    expect(WhereValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Where', () => {
        const whereValidator = new WhereValidator();
        const fn = (): boolean => true;
        expect(whereValidator.canValidate(new Where(fn))).to.be.true;
      });
    });

    context('implicit expectation', () => {
      it('returns true for implicit expectation as a anonymous function', () => {
        const whereValidator = new WhereValidator();
        const fn = (): boolean => true;
        expect(whereValidator.canValidate(fn)).to.be.true;
      });

      it('returns true for implicit expectation as named function', () => {
        const whereValidator = new WhereValidator();
        function fn(): boolean {
          return true;
        }
        expect(whereValidator.canValidate(fn)).to.be.true;
      });

      it('returns true for implicit expectation as class method functions', () => {
        const whereValidator = new WhereValidator();
        class MyClass {
          myMethod(): boolean {
            return true;
          }
        }
        const instance = new MyClass();
        expect(whereValidator.canValidate(MyClass.prototype.myMethod)).to.be
          .true;
        expect(whereValidator.canValidate(instance.myMethod)).to.be.true;
      });

      it.skip('returns false for constructor functions', () => {
        class MyClass {}

        const whereValidator = new WhereValidator();
        expect(whereValidator.canValidate(MyClass)).to.be.false;
        expect(whereValidator.canValidate(Error)).to.be.false;
        expect(whereValidator.canValidate(EvalError)).to.be.false;
        expect(whereValidator.canValidate(RangeError)).to.be.false;
        expect(whereValidator.canValidate(ReferenceError)).to.be.false;
        expect(whereValidator.canValidate(SyntaxError)).to.be.false;
        expect(whereValidator.canValidate(TypeError)).to.be.false;
        expect(whereValidator.canValidate(URIError)).to.be.false;
        expect(whereValidator.canValidate(MyError)).to.be.false;
      });

      it('returns false for any other expectation that is not instance of Where or is not a function', () => {
        const INVALID_EXPECTATIONS: any[] = [
          // Native types
          String,
          Boolean,
          Date,
          Number,
          RegExp,
          Function,
          Symbol,
          Map,
          Object,
          Array,
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
          Math.PI,
          -Math.PI,
          Number.MAX_VALUE,
          -Number.MAX_VALUE,
          1,
          0,
          -1,
          -1,
          -2147483648,
          2147483647,
          // Regexp
          new RegExp(/fail/),
          /fail/,
          // Symbol
          [Symbol('key'), "Symbol('key')"],
          // Map
          new Map([['key', 'value']]),
          // Classes
          new ParentClass('test'),
          new ChildClass('test'),
          // Errors
          new Error(),
          new EvalError(),
          new RangeError(),
          new ReferenceError(),
          new SyntaxError(),
          new TypeError(),
          new URIError(),
          new MyError('my-message'),
          // Objects
          {
            my: 'object',
          },
          // Arrays
          [],
          [String],
          [['abcd'], `[String('abcd')]`],
          [true],
          [new Date('2017-02-06T20:43:13.464Z')],
          [Infinity],
          [Math.PI],
          [Number.MAX_VALUE],
          [0],
          [new RegExp(/fail/)],
          [/fail/],
          [(): boolean => true],
          [[Symbol('test')], "[Symbol('test')]"],
          [new Map([['key', 'value']])],
          [ParentClass],
          [new ParentClass('test')],
          [
            [
              {
                my: 'object',
              },
            ],
            '[{"my":"object"}]',
          ],
        ];
        const whereValidator = new WhereValidator();
        for (const expectation of INVALID_EXPECTATIONS) {
          const expectationStr = inspect(expectation);
          expect(
            whereValidator.canValidate(expectation),
            `Expected implicit expectation ${expectationStr} to be not applicable`
          ).to.false;
        }
      });
    });
  });

  describe('validation', () => {
    it('ensures that expectation is pulled from Where instance correctly', () => {
      const whereValidator = new WhereValidator();

      const fn = (value: string): boolean => value === 'my-string';
      const value = 'my-string';
      const where = new Where(fn);

      expect(whereValidator.validate(value, where)).to.be.true;
    });

    context('valid values', () => {
      it('returns true for value that is valid by executing expectation as evaluating function', () => {
        const whereValidator = new WhereValidator();

        const expectation = (value: string): boolean =>
          value === 'my-valid-value';
        const value = 'my-valid-value';

        expect(whereValidator.validate(value, expectation)).to.be.true;
      });
    });

    context('invalid values', () => {
      it('pass-through any error thrown inside expectation function on evaluated invalid value', () => {
        const whereValidator = new WhereValidator();
        const error = new ValidationError('my-error');
        const expectation = (value: string): boolean => {
          if (value === 'my-invalid-value') {
            throw error;
          }
          return true;
        };
        const value = 'my-invalid-value';

        expect(() => whereValidator.validate(value, expectation)).to.throw(
          error
        );
      });

      it('throws ValidationError as a fallback if expectation function returns false for invalid value', () => {
        const whereValidator = new WhereValidator();

        const expectation = (value: string): boolean =>
          value === 'my-valid-value';
        const value = 'my-invalid-value';

        expect(() => whereValidator.validate(value, expectation)).to.throw(
          ValidationError,
          'Failed Where validation'
        );
      });
    });
  });
});
