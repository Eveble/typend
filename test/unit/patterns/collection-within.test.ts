import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { CollectionWithin } from '../../../src/patterns/collection-within';
import { InvalidDefinitionError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { types } from '../../../src/types';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`CollectionWithin`, function () {
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
    expect(CollectionWithin.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('takes valid definition as properties of object literal for construction', () => {
      const props = { key: 'value' };
      expect(new CollectionWithin(props)).to.eql(props);
    });

    it(`has assigned 'OBJECT_WITHIN' as type kind`, () => {
      const collectionWithin = new CollectionWithin({});
      expect(collectionWithin.getKind()).to.be.equal(KINDS.OBJECT_WITHIN);
    });

    it('throws InvalidDefinitionError for invalid definition on construction', () => {
      for (const props of INVALID_ARGUMENTS) {
        const propsStr = inspect(props);
        describer.describe.returns(propsStr);
        expect(
          () => new CollectionWithin(props),
          `Expected properties ${propsStr} to be invalid`
        ).to.throw(
          InvalidDefinitionError,
          `CollectionWithin properties is invalid. Expected properties to be a plain object, got ${propsStr}`
        );
      }
    });
  });
});
