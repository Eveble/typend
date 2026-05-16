import { describe, it, expect, beforeEach } from 'vitest';
import { stubInterface } from '../../vitest-helper';
import { inspect } from 'util';
import { InvalidTypeError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`InstanceOf`, () => {
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

  const VALID_TYPES: any[] = [
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
    // Error constructors
    Error,
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
    MyError,
    // Classes constructors
    ParentClass,
    ChildClass,
  ];

  const INVALID_TYPES: any[] = [
    // Function
    (): boolean => true,
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
    // 1, Skip since there is issue with Mocha serialization on canonicalize
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
    // Classes instances
    new ParentClass('test'),
    new ChildClass('test'),
    // Errors instances
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
    expect(InstanceOf.prototype).toBeInstanceOf(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid type for construction', () => {
      for (const type of VALID_TYPES) {
        const typeStr = inspect(type);
        describer.describe.returns(typeStr);
        expect(
          new InstanceOf(type),
          `Expected type ${typeStr} to be valid`
        ).toEqual([type]);
      }
    });

    it(`has assigned 'INSTANCE_OF' as type kind`, () => {
      const pattern = new InstanceOf(String);
      expect(pattern.getKind()).toBe(KINDS.INSTANCE_OF);
    });

    it('throws InvalidTypeError for invalid type on construction', () => {
      for (const type of INVALID_TYPES) {
        const typeStr = inspect(type);
        describer.describe.returns(typeStr);
        expect(
          () => new InstanceOf(type),
          `Expected type ${typeStr} to be invalid`
        ).toThrow(
          InvalidTypeError,
          `InstanceOf type is invalid. Expected type to be nil, a native type constructor, class, got ${typeStr}`
        );
      }
    });
  });

  describe('Mocha serialization edge cases', () => {
    it('handles numeric value (1) passed during Mocha canonicalization without throwing', () => {
      // This simulates what happens when Mocha's canonicalize function
      // tries to serialize InstanceOf for test output display
      expect(() => {
        new InstanceOf(1 as any);
      }).not.toThrow();
    });

    it('handles array length property access during serialization', () => {
      // When Mocha iterates over InstanceOf (which extends Array),
      // it may try to reconstruct it with array indices
      const instance = new InstanceOf(String);

      // Simulate what Mocha does during canonicalization
      expect(() => {
        // This mimics accessing array properties during iteration
        const reconstructed = new InstanceOf(instance[0]);
        expect(reconstructed[0]).toBe(String);
      }).not.toThrow();

      // Verify the instance still behaves correctly
      expect(instance[0]).toBe(String);
      expect(instance.length).toBe(1);
    });
  });
});
