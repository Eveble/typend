import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { OneOf } from '../../../src/patterns/one-of';
import { InvalidDefinitionError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`OneOf`, function () {
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

  const SINGLE_VALID_EXPECTATIONS: any[] = [
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
  ];
  const MULTI_VALID_EXPECTATIONS: any[] = [
    // Arrays
    [String, Number],
    ['abcd', 5],
    [true, false],
    [new Date('2017-02-06T20:43:13.464Z'), 'tomorrow'],
    [Infinity, -Infinity],
    [Math.PI, -Math.PI],
    [Number.MAX_VALUE, -Number.MAX_VALUE],
    [-1, 0, 1],
    ['first', 'second', 'third', 'fourth', 'fifth'],
    [new RegExp(/fail/), 'fail'],
    [/fail/, /win/],
    [
      (): boolean => {
        return true;
      },
      Function,
    ],
    [Symbol('key'), Symbol('key-other')],
    [new Map([['key', 'value']]), new Map([['other-key', 'other-value']])],
    [ParentClass, ChildClass],
    [new ParentClass('test'), new ChildClass('test')],
    [
      {
        my: 'object',
      },
      {
        other: 'other-object',
      },
    ],
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
    expect(OneOf.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid expectation with one argument for construction', () => {
      for (const expectation of SINGLE_VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new OneOf(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([expectation]);
      }
    });

    it('takes valid expectation with more then one argument for construction', () => {
      for (const expectation of MULTI_VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new OneOf(...expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([...expectation]);
      }
    });

    it(`has assigned 'ONE_OF' as type kind`, () => {
      const pattern = new OneOf(String, Number);
      expect(pattern.getKind()).to.be.equal(KINDS.ONE_OF);
    });

    it('throws InvalidDefinitionError for empty expectation', () => {
      const expectation = [];
      const expectationStr = inspect(expectation);
      describer.describe.returns(expectationStr);
      expect(
        () => new OneOf(),
        `Expected expectation ${expectationStr} to be invalid`
      ).to.throw(
        InvalidDefinitionError,
        `OneOf expectation is invalid. Expectation must include at least one element defined like: <oneOf(String, Number, 'value')>, got ${expectationStr}`
      );
    });
  });
});
