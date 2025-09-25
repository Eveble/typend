import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { InvalidTypeError, UndefinableClassError } from '../../../src/errors';
import { Utility } from '../../../src/utility';
import { TypeOf } from '../../../src/utilities/type-of';
import { types } from '../../../src/types';
import { Collection } from '../../../src/patterns/collection';
import { Class } from '../../../src/patterns/class';
import { validable } from '../../../src/annotations/validable';
import { Any } from '../../../src/patterns/any';
import { WrapperPattern } from '../../../src/wrapper-pattern';
import { Type } from '../../../src/decorators/type.decorator';

describe(`TypeOf`, function () {
  let converter: any;
  let library: any;
  let describer: any;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    library = stubInterface<types.Library>();
    library.converter = converter;
    describer = stubInterface<types.Describer>();
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
    (): boolean => {
      return true;
    },
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
    expect(TypeOf.prototype).to.instanceof(WrapperPattern);
  });

  describe('construction', () => {
    it('takes valid type as a class constructor', () => {
      const instance = new TypeOf(ParentClass);
      expect(instance).to.eql([ParentClass]);
    });

    it('takes valid type as a error constructor', () => {
      const instance = new TypeOf(MyError);
      expect(instance).to.eql([MyError]);
    });

    it('throws InvalidTypeError for invalid type on construction', () => {
      for (const type of INVALID_TYPES) {
        const typeStr = inspect(type);
        describer.describe.returns(typeStr);
        expect(
          () => new TypeOf(type),
          `Expected type ${typeStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Type is invalid. Expected type to be a class constructor, got ${typeStr}`
        );
      }
    });
  });

  describe('generation', () => {
    it(`generates instance of Type pattern for type`, () => {
      @Type()
      class MyClass {
        value: string;
      }

      const typeOf = new TypeOf(MyClass);
      const definition = new Collection({
        value: String,
      });
      const type = new Class(MyClass, definition);
      library.converter.convert.withArgs(MyClass).returns(type);
      const generatedResult = typeOf.generate(library) as Class;
      expect(generatedResult).to.be.instanceOf(Class);
      expect(generatedResult.type).to.be.equal(MyClass);
      expect(generatedResult.properties).to.be.eql(definition);
    });

    it(`generates instance of Any pattern for non-validable types`, () => {
      @validable(false)
      @Type()
      class MyClass {
        value: string;
      }

      const typeOf = new TypeOf(MyClass);
      const generatedResult = typeOf.generate(library) as Class;
      expect(generatedResult).to.be.instanceOf(Any);
    });

    it(`throws UndefinableClassError on non-definable types`, () => {
      class MyClass {
        value: string;
      }

      const typeOf = new TypeOf(MyClass);
      expect(() => typeOf.generate(library)).to.throw(
        UndefinableClassError,
        `MyClass: provided argument must be a class that implements '@Type()' decorator`
      );
    });
  });
});
