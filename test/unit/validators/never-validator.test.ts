import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { NeverValidator } from '../../../src/validators/never-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { Never } from '../../../src/patterns/never';
import { ValidationError } from '../../../src/errors';
import { types } from '../../../src/types';

describe(`NeverValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  /*
    TEST DATA
    */
  class ParentClass {
    public value: any;

    constructor(value: any) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}

  it(`extends PatternValidator`, () => {
    expect(NeverValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    it('returns true for pattern instance of Never', () => {
      const neverValidator = new NeverValidator();
      expect(neverValidator.canValidate(new Never())).to.be.true;
    });

    it('returns false for any other implicit expectation', () => {
      const neverValidator = new NeverValidator();
      expect(neverValidator.canValidate(true)).to.be.false;
      expect(neverValidator.canValidate(false)).to.be.false;
      expect(neverValidator.canValidate(undefined)).to.be.false;
      expect(neverValidator.canValidate(null)).to.be.false;
    });
  });

  describe('validation', () => {
    it('returns true for undefined value', () => {
      const neverValidator = new NeverValidator();
      expect(neverValidator.validate(undefined)).to.be.true;
    });

    it('returns false for any other value', () => {
      const INVALID_VALUES: any[] = [
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
        -1,
        -2147483648,
        2147483647,
        // Regexp
        new RegExp(/fail/),
        /fail/,
        // Function
        (): boolean => true,
        // Symbol
        [Symbol('key'), "Symbol('key')"],
        // Map
        new Map([['key', 'value']]),
        // Classes
        ParentClass,
        new ParentClass('test'),
        ChildClass,
        new ChildClass('test'),
        // Errors
        Error,
        new Error(),
        EvalError,
        new EvalError(),
        RangeError,
        new RangeError(),
        ReferenceError,
        new ReferenceError(),
        SyntaxError,
        new SyntaxError(),
        TypeError,
        new TypeError(),
        URIError,
        new URIError(),
        MyError,
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

      for (const val of INVALID_VALUES) {
        const neverValidator = new NeverValidator();
        const valStr = inspect(val);
        describer.describe.withArgs(val).returns(valStr);

        expect(() => neverValidator.validate(val)).to.throw(
          ValidationError,
          `Expected value to never be assigned, got ${valStr}`
        );
      }
    });
  });
});
