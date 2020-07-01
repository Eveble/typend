import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Equals } from '../../../src/patterns/equals';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { InvalidTypeError } from '../../../src/errors';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`Equals`, function () {
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
    Symbol('key'),
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
    // Class constructors for reference based equality validation
    ParentClass,
    ChildClass,
    // Error constructors for reference based equality validation
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    MyError,
  ];

  const INVALID_EXPECTATIONS: any[] = [
    // Objects
    {
      my: 'object',
    },
    // Arrays
    [],
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
    [
      (): boolean => {
        return true;
      },
    ],
    [Symbol('test')],
    [new Map([['key', 'value']])],
    [ParentClass],
    [new ParentClass('test')],
    [
      {
        my: 'object',
      },
    ],
  ];

  it(`extends Array`, () => {
    expect(Equals.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid expectation for construction', () => {
      for (const expectation of VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new Equals(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([expectation]);
      }
    });

    it(`has assigned 'EQUALS' as type kind`, () => {
      const equals = new Equals('my-expectation');
      expect(equals.getKind()).to.be.equal(KINDS.EQUALS);
    });

    it('throws InvalidTypeError for invalid expectation on construction', () => {
      for (const expectation of INVALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          () => new Equals(expectation),
          `Expected expectation ${expectationStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Equality pattern expectation is invalid. Expected expectation to not be an plain object nor an array, got ${expectationStr}`
        );
      }
    });
  });
});
