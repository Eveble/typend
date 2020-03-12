import { expect } from 'chai';
import { inspect } from 'util';
import { stubInterface } from 'ts-sinon';
import { List } from '../../../src/patterns/list';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { InvalidDefinitionError } from '../../../src/errors';
import { OneOf } from '../../../src/patterns/one-of';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`List`, function() {
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
    // [!] Allow for nested pattern like OneOf
    [new OneOf([String, Number])],
    // Native types
    Array,
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
  ];

  it(`extends Array`, () => {
    expect(List.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid single argument expectation for construction', () => {
      for (const expectation of VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.returns(expectationStr);
        expect(
          new List(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).to.eql([expectation]);
      }
    });

    it(`has assigned 'ARRAY' as type kind`, () => {
      const pattern = new List(Array);
      expect(pattern.getKind()).to.be.equal(KINDS.ARRAY);
    });

    it('throws InvalidDefinitionError for more then one argument(use Tuple pattern for that)', () => {
      const values = [1, 2];
      const valueStr = inspect(values);
      describer.describe.returns(valueStr);
      expect(
        () => new List(...values),
        `Expected expectation ${valueStr} to be invalid`
      ).to.throw(
        InvalidDefinitionError,
        `List expectation is invalid. Expected expectation to have maximum of one argument, got ${valueStr}`
      );
    });
  });
});
