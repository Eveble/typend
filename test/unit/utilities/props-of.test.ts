import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { mock } from 'vitest-mock-extended';
import { inspect } from 'util';
import { InvalidTypeError } from '../../../src/errors';
import { Utility } from '../../../src/utility';
import { PropsOf } from '../../../src/utilities/props-of';
import { types } from '../../../src/types';
import { Collection } from '../../../src/patterns/collection';
import { Class } from '../../../src/patterns/class';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe(`PropsOf`, () => {
  let converter: any;
  let library: any;
  let describer: any;

  beforeEach(() => {
    converter = mock<types.Converter>();
    library = mock<types.Library>();
    library.converter = converter;
    describer = mock<types.Describer>();
    Utility.setDescriber(describer);
  });

  class ParentClass {
    public value: string;

    constructor(value: string) {
      this.value = value;
    }
  }
  class ChildClass extends ParentClass {}

  class MyError extends Error {}

  const INVALID_TYPES: any[] = [
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
    expect(PropsOf.prototype).toBeInstanceOf(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid type as a class constructor', () => {
      const propsOf = new PropsOf(ParentClass);
      expect(propsOf).toEqual([ParentClass]);
    });

    it('takes valid type as a error constructor', () => {
      const propsOf = new PropsOf(MyError);
      expect(propsOf).toEqual([MyError]);
    });

    it('throws InvalidTypeError for invalid type on construction', () => {
      for (const type of INVALID_TYPES) {
        const typeStr = inspect(type);
        describer.describe.mockReturnValue(typeStr);
        expect(
          () => new PropsOf(type),
          `Expected type ${typeStr} to be invalid`
        ).toThrow(
          InvalidTypeError,
          `PropsOf type is invalid. Expected type to be class, got ${typeStr}`
        );
      }
    });
  });

  describe('generation', () => {
    it(`generates instance of Collection for type's properties`, () => {
      class MyClass {
        value: string;
      }

      const propsOf = new PropsOf(MyClass);
      const definition = new Collection({
        value: String,
      });
      const type = new Class(MyClass, definition);
      library.converter.convert.calledWith(MyClass).mockReturnValue(type);
      const generatedResult = propsOf.generate(library);
      expect(generatedResult).toBeInstanceOf(Collection);
      expect(generatedResult).toEqual(definition);
    });
  });
});
