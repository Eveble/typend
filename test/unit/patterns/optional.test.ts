import { describe, it, expect, beforeEach } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { inspect } from 'util';
import { Optional } from '../../../src/patterns/optional';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Optional`, () => {
  let describer: any;

  beforeEach(() => {
    describer = mock<types.Describer>();
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
  ];

  it(`extends Array`, () => {
    expect(Optional.prototype).toBeInstanceOf(Array);
  });

  describe('construction', () => {
    it('takes any expectation for construction', () => {
      for (const expectation of VALID_EXPECTATIONS) {
        const expectationStr = inspect(expectation);
        describer.describe.mockReturnValue(expectationStr);
        expect(
          new Optional(expectation),
          `Expected expectation ${expectationStr} to be valid`
        ).toEqual([expectation]);
      }
    });

    it(`has assigned 'OPTIONAL' as type kind`, () => {
      const pattern = new Optional(null);
      expect(pattern.getKind()).toBe(KINDS.OPTIONAL);
    });
  });

  it('describes provided value to string', () => {
    Optional.setDescriber(describer);

    const pattern = new Optional();
    const val = 'my-value';
    const valStr = `String('my-value'`;
    describer.describe.calledWith(val).mockReturnValue(valStr);

    expect(pattern.describe(val)).toBe(valStr);
    expect(describer.describe).toHaveBeenCalledTimes(1);
    expect(describer.describe).toHaveBeenCalledWith(val);
  });

  describe('property initializers', () => {
    describe('evaluation', () => {
      it('returns true if property initializer is set on pattern', () => {
        const pattern = new Optional();
        pattern.setInitializer('my-initializer-value');
        expect(pattern.hasInitializer()).toBe(true);
      });
      it('returns false if property initializer is missing from pattern', () => {
        const pattern = new Optional();
        expect(pattern.hasInitializer()).toBe(false);
      });
    });
    it('sets the property initializer on pattern', () => {
      const pattern = new Optional();
      const initializer = 'my-initializer-value';
      pattern.setInitializer(initializer);
      expect(pattern.getInitializer()).toBe(initializer);
    });
  });
});
