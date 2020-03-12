import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { UnknownValidator } from '../../../src/validators/unknown-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import { Unknown } from '../../../src/patterns/unknown';

describe(`UnknownValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  class ParentClass {
    public value: unknown;

    constructor(value: unknown) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}

  it(`extends PatternValidator`, () => {
    expect(UnknownValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    it('returns true for pattern instance of Unknown', () => {
      const unknownValidator = new UnknownValidator();
      expect(unknownValidator.canValidate(new Unknown())).to.be.true;
    });

    it('returns false for any other implicit expectation', () => {
      const unknownValidator = new UnknownValidator();

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
        Error,
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
        (): boolean => {
          return true;
        },
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
        [
          (): boolean => {
            return true;
          },
        ],
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

      for (const expectation of INVALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        expect(
          unknownValidator.canValidate(expectation),
          `Expected implicit expectation ${expectationStr} to be not applicable`
        ).to.false;
      }
    });
  });

  describe('validation', () => {
    it('returns true always for unknown value', () => {
      const unknownValidator = new UnknownValidator();
      expect(
        unknownValidator.validate(),
        `Expected validation of unknown value to always be true`
      ).to.true;
    });
  });
});
