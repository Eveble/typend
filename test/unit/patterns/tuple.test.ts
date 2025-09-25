import { expect } from 'chai';
import { inspect } from 'util';
import { stubInterface } from 'ts-sinon';
import { Tuple } from '../../../src/patterns/tuple';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { InvalidDefinitionError } from '../../../src/errors';
import { OneOf } from '../../../src/patterns/one-of';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`Tuple`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    Pattern.setDescriber(describer);
  });

  class ParentClass {
    public value: any;

    constructor(value: any) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}

  const VALID_EXPECTATIONS: any[] = [
    [new OneOf([String, Number])],
    [String, Number],
    [String],
    ['abcd'],
    [true],
    [new Date('2017-02-06T20:43:13.464Z')],
    [Infinity],
    [Math.PI],
    [Number.MAX_VALUE],
    [0],
    [new RegExp(/fail/)],
    [/fail/],
    [(): boolean => true],
    [Symbol('test')],
    [new Map([['key', 'value']])],
    [ParentClass],
    [new ParentClass('test')],
    [
      {
        my: 'object',
      },
    ],
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
    (): boolean => true,
    // Symbol
    Symbol('key'),
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
    // Empty arrays
    [],
  ];

  it(`extends Array`, () => {
    expect(Tuple.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid expectation for construction', () => {
      for (const expectation of VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new Tuple(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([expectation]);
      }
    });

    it('takes valid expectation as multiple arguments for', () => {
      for (const expectation of VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new Tuple(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([expectation]);
      }
    });

    it(`has assigned 'TUPLE' as type kind`, () => {
      const pattern = new Tuple([String]);
      expect(pattern.getKind()).to.be.equal(KINDS.TUPLE);
    });

    it('throws InvalidDefinitionError for none-arguments(use List pattern for that)', () => {
      const expectations = [];
      const expectationStr = inspect(expectations);
      describer.describe.returns(expectationStr);
      expect(
        () => new Tuple(...expectations),
        `Expected expectation ${expectationStr} to be invalid`
      ).to.throw(
        InvalidDefinitionError,
        `Tuple expectation is invalid. Expectation must include at least one argument defined like: <tuple(String, Number, 'value')>, got ${expectationStr}`
      );
    });
  });
});
