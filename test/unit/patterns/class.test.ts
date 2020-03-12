import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { InvalidDefinitionError, InvalidTypeError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { Class } from '../../../src/patterns/class';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Class`, function() {
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

  const INVALID_DEFINITION: any[] = [
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

  it(`extends Pattern`, () => {
    expect(Class.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('takes valid type as a class constructor and its properties', () => {
      const properties = { value: String };
      const result = new Class(ParentClass, properties);
      expect(result.type).to.equal(ParentClass);
      expect(result.properties).to.equal(properties);
    });

    it('takes valid type as a error constructor and its properties', () => {
      const properties = { message: String };
      const result = new Class(MyError, properties);
      expect(result.type).to.equal(MyError);
      expect(result.properties).to.equal(properties);
    });

    it(`has assigned 'CLASS' as type kind`, () => {
      const pattern = new Class(ParentClass, { value: String });
      expect(pattern.getKind()).to.be.equal(KINDS.CLASS);
    });

    it('throws InvalidTypeError for invalid type on construction', () => {
      for (const type of INVALID_TYPES) {
        const typeStr = inspect(type);
        describer.describe.returns(typeStr);
        expect(
          () => new Class(type, {}),
          `Expected type ${typeStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Class type is invalid. Expected type to be a class constructor, got ${typeStr}`
        );
      }
    });

    it('throws InvalidDefinitionError for invalid properties on construction', () => {
      for (const description of INVALID_DEFINITION) {
        const descriptionStr = inspect(description);
        describer.describe.returns(descriptionStr);
        expect(
          () => new Class(ParentClass, description),
          `Expected definition ${descriptionStr} to be invalid`
        ).to.throw(
          InvalidDefinitionError,
          `Class properties are invalid. Expected properties to be a plain object or Collection instance describing class properties, got ${descriptionStr}`
        );
      }
    });
  });
});
