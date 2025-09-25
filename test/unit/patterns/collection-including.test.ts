import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { CollectionIncluding } from '../../../src/patterns/collection-including';
import { InvalidTypeError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`CollectionIncluding`, () => {
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

  const INVALID_ARGUMENTS: any[] = [
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

  it(`extends Pattern`, () => {
    expect(CollectionIncluding.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('takes valid definition as properties of object literal for construction', () => {
      const props = { key: 'value' };
      expect(new CollectionIncluding(props)).to.eql(props);
    });

    it(`has assigned 'OBJECT_INCLUDING' as type kind`, () => {
      const collInc = new CollectionIncluding({});
      expect(collInc.getKind()).to.be.equal(KINDS.OBJECT_INCLUDING);
    });

    it('throws InvalidTypeError for invalid definition on construction', () => {
      for (const props of INVALID_ARGUMENTS) {
        const propsStr = inspect(props);
        describer.describe.returns(propsStr);
        expect(
          () => new CollectionIncluding(props),
          `Expected properties ${propsStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `CollectionIncluding properties are invalid. Expected properties to be a plain object, got ${propsStr}`
        );
      }
    });
  });
});
