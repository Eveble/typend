import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Where } from '../../../src/patterns/where';
import { InvalidTypeError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`Where`, function () {
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
    expect(Where.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid expectation as a function for construction', () => {
      const expectation = (): boolean => {
        return true;
      };
      const expectationStr = inspect(expectation);
      describer.describe.returns(expectationStr);
      expect(
        new Where(expectation),
        `Expected expectation ${expectationStr} to be valid`
      ).to.eql([expectation]);
    });

    it.skip('throws InvalidTypeError for constructor functions', () => {
      const constructors: any[] = [
        ParentClass,
        ChildClass,
        Error,
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError,
        MyError,
        Error,
      ];
      for (const expectation of constructors) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          () => new Where(expectation),
          `Expected expectation ${expectationStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Where expectation is invalid. Expected expectation to be a Function, got ${expectationStr}`
        );
      }
    });

    it('throws InvalidTypeError for invalid expectation on construction', () => {
      for (const expectation of INVALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          () => new Where(expectation),
          `Expected expectation ${expectationStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Where expectation is invalid. Expected expectation to be a Function, got ${expectationStr}`
        );
      }
    });

    it(`has assigned 'WHERE' as type kind`, () => {
      const pattern = new Where((): boolean => {
        return true;
      });
      expect(pattern.getKind()).to.be.equal(KINDS.WHERE);
    });
  });
});
