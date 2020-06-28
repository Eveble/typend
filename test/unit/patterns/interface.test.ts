import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { InvalidTypeError } from '../../../src/errors';
import { Pattern } from '../../../src/pattern';
import { Interface } from '../../../src/patterns/interface';
import { types } from '../../../src/types';
import { Collection } from '../../../src/patterns/collection';
import { KINDS } from '../../../src/constants/literal-keys';

describe(`Interface`, function () {
  let converter: any;
  let library: any;
  let describer: any;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    library = stubInterface<types.Library>();
    library.converter = converter;
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
    expect(Interface.prototype).to.instanceof(Pattern);
  });

  describe('construction', () => {
    it('takes valid properties as object literal for construction', () => {
      const props = { key: 'value' };
      expect(new Interface(props)).to.eql(props);
    });

    it('takes valid properties as instance of Collection for construction', () => {
      const collection = new Collection({ key: 'value' });
      expect(new Interface(collection)).to.eql(collection);
    });

    it(`has assigned 'INTERFACE' as type kind`, () => {
      const pattern = new Interface({});
      expect(pattern.getKind()).to.be.equal(KINDS.INTERFACE);
    });

    it('throws InvalidTypeError for invalid expectations on construction', () => {
      for (const props of INVALID_EXPECTATIONS) {
        const propsStr = inspect(props);
        describer.describe.returns(propsStr);
        expect(
          () => new Interface(props),
          `Expected expectation ${propsStr} to be invalid`
        ).to.throw(
          InvalidTypeError,
          `Interface properties are invalid. Expected properties to be a plain object or Collection instance describing interface properties, got ${propsStr}`
        );
      }
    });
  });

  describe('naming', () => {
    it('allows to set name of interface without modifying the definition', () => {
      const props = { key: 'value', name: 'my-name' };
      const intf = new Interface(props);
      const name = 'MyInterface';
      intf.setName(name);
      expect(intf.getName()).to.be.equal(name);
      expect((intf as any).name).to.be.equal('my-name');
    });

    it('ensures that interface name is set on prototype and is not leaked to other instances', () => {
      const firstIntf = new Interface({ key: 'first-value' });
      firstIntf.setName('first');
      const secondIntf = new Interface({ key: 'second-value' });
      secondIntf.setName('second');
      expect(firstIntf.getName()).to.be.equal('first');
      expect(secondIntf.getName()).to.be.equal('second');
    });
  });
});
