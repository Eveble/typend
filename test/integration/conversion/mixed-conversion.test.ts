import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { define } from '../../../src/decorators/define';
import { converter } from './setup';
import { Any } from '../../../src/patterns/any';
import { Void } from '../../../src/patterns/void';
import { Never } from '../../../src/patterns/never';
import { Unknown } from '../../../src/patterns/unknown';
import { Unrecognized } from '../../../src/patterns/unrecognized';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Equals } from '../../../src/patterns/equals';
import { Optional } from '../../../src/patterns/optional';
import { OneOf } from '../../../src/patterns/one-of';
import { Tuple } from '../../../src/patterns/tuple';
import { Collection } from '../../../src/patterns/collection';
import { List } from '../../../src/patterns/list';
import { Integer } from '../../../src/patterns/integer';
import { $PropsOf } from '../../../src/utility-types';
import { Class } from '../../../src/patterns/class';
import { Interface } from '../../../src/patterns/interface';

describe(`Mixed conversion`, function () {
  type optional<T> = T | undefined;

  @define()
  class MyClass {
    field: string;
  }

  interface InterfaceType {
    field: string;
    otherField: number;
  }

  const symbolAsAKey = Symbol('some key');

  type ObjectType = {
    key: string;
    69: number;
  };

  type ObjectTypeWithSymbol = {
    key: string;
    69: number;
    [symbolAsAKey]: string; // Symbols are not iterable(!), thats why were using Reflect.ownKeys on TSRuntimeConverter.prototype.decodeProps
  };

  enum NumberEnum {
    a = 1,
    b,
  }

  enum StringEnum {
    a = 'a',
    b = 'b',
  }

  enum MixedEnum {
    a = 'a',
    b = 2,
  }

  enum DefaultEnum {
    a,
    b,
    c,
  }

  @define()
  class MyType {
    any: any;

    string: string;

    number: number;

    symbol: symbol;

    void: void;

    undefined: undefined;

    null: null;

    never: never;

    unknown: unknown;

    boolean: boolean;

    true: true;

    false: false;

    stringLiteral = 'my-string';

    numberLiteral = 1337;

    symbolLiteral = Symbol.for('my-string');

    function: Function;

    functionDef: () => void;

    stringWithBang!: string;

    optionalString?: string;

    undefinedOrString: undefined | string;

    nullableOrString: null | string;

    numberEnumLiteral = NumberEnum;

    stringEnumLiteral = StringEnum;

    mixedEnumLiteral = MixedEnum;

    defaultEnumLiteral = DefaultEnum;

    stringTuple: [string];

    numberTuple: [number];

    nullTuple: [null];

    undefinedTuple: [undefined];

    stringNumberTuple: [string, number];

    mixedTuple: [string, number, null, undefined, never];

    optionalMixedTuple?: [string, number, null, undefined, never];

    optionalMixedNestedTuple?: [
      string,
      number,
      null,
      undefined,
      never,
      [string, number, null, undefined, never]
    ];

    objectRecord: Record<string, any>;

    objectLiteral: { name: string; age: number };

    objectLiteralEmpty: {};

    objectType: ObjectType;

    objectTypeWithSymbol: ObjectTypeWithSymbol;

    objectNested: {
      first: {
        second: {
          'third-tuple': [string, number];
        };
        'second-key': number;
      };
      'first-key': string;
    };

    class: MyClass;

    interface: InterfaceType;

    array: Array<any>;

    arrayWithNumber: number[];

    arrayWithLiteralString: 'a'[];

    arrayWithLiteralNumber: 69[];

    arrayWithStrings: Array<string>;

    simpleGeneric: optional<string>;

    regexp: RegExp;

    integer: Integer;

    [symbolAsAKey]: string;

    object: object; // Urecognized, reflectedType.kind: 999
  }
  describe('reflection', () => {
    const expectedProps = {
      any: new Any(),
      string: String,
      number: Number,
      symbol: Symbol,
      void: new Void(),
      undefined,
      null: null,
      never: new Never(),
      unknown: new Unknown(),
      boolean: Boolean,
      true: true,
      false: false,
      stringLiteral: String,
      numberLiteral: Number,
      symbolLiteral: Symbol,
      function: Function,
      functionDef: Function,
      stringWithBang: String,
      optionalString: [String, undefined],
      undefinedOrString: [String, undefined],
      nullableOrString: [String, null],
      numberEnumLiteral: { '1': 'a', '2': 'b', a: 1, b: 2 },
      stringEnumLiteral: { a: 'a', b: 'b' },
      mixedEnumLiteral: { '2': 'b', a: 'a', b: 2 },
      defaultEnumLiteral: { '0': 'a', '1': 'b', '2': 'c', a: 0, b: 1, c: 2 },
      stringTuple: [String],
      numberTuple: [Number],
      nullTuple: [null],
      undefinedTuple: [undefined],
      stringNumberTuple: [String, Number],
      mixedTuple: [String, Number, null, undefined, new Never()],
      optionalMixedTuple: [
        [String, Number, null, undefined, new Never()],
        undefined,
      ],
      optionalMixedNestedTuple: [
        [
          String,
          Number,
          null,
          undefined,
          new Never(),
          [String, Number, null, undefined, new Never()],
        ],
        undefined,
      ],
      objectRecord: {},
      objectLiteral: { name: String, age: Number },
      objectLiteralEmpty: {},
      objectType: { '69': Number, key: String },
      objectTypeWithSymbol: {
        '69': Number,
        key: String,
        [symbolAsAKey]: String,
      },
      objectNested: {
        first: {
          second: { 'third-tuple': [String, Number] },
          'second-key': Number,
        },
        'first-key': String,
      },
      class: MyClass,
      interface: { field: String, otherField: Number },
      array: [new Any()],
      arrayWithNumber: [Number],
      arrayWithLiteralString: ['a'],
      arrayWithLiteralNumber: [69],
      arrayWithStrings: [String],
      simpleGeneric: [String, undefined],
      regexp: RegExp,
      integer: Integer,
      object: new Unrecognized(),
      [symbolAsAKey]: String,
    };

    it('returns reflected type', () => {
      const properties = converter.reflect(MyType);
      expect(properties).to.be.instanceof(Object);

      for (const [key, value] of Object.entries(properties)) {
        expect(
          expectedProps[key as any],
          `Expected ${key} to match properties`
        ).to.be.eql(value);
      }
    });

    it(`returns reflected type properties by use of '$PropsOf'`, () => {
      const properties = converter.reflect(reflect<$PropsOf<MyType>>());
      expect(properties).to.be.instanceof(Object);

      for (const [key, value] of Object.entries(properties)) {
        expect(
          expectedProps[key as any],
          `Expected ${key} to match properties`
        ).to.be.eql(value);
      }
    });
  });

  describe('conversion', () => {
    const expectedProps = {
      any: new Any(),
      string: new InstanceOf(String),
      number: new InstanceOf(Number),
      // eslint-disable-next-line no-new-symbol
      symbol: new InstanceOf(Symbol),
      void: new Void(),
      undefined,
      null: null,
      never: new Never(),
      unknown: new Unknown(),
      boolean: new InstanceOf(Boolean),
      true: new Equals(true),
      false: new Equals(false),
      stringLiteral: new InstanceOf(String),
      numberLiteral: new InstanceOf(Number),
      // eslint-disable-next-line no-new-symbol
      symbolLiteral: new InstanceOf(Symbol),
      function: new InstanceOf(Function),
      functionDef: new InstanceOf(Function),
      stringWithBang: new InstanceOf(String),
      optionalString: new Optional(new InstanceOf(String)),
      undefinedOrString: new Optional(new InstanceOf(String)),
      nullableOrString: new OneOf(null, new InstanceOf(String)),
      numberEnumLiteral: new Collection({ '1': 'a', '2': 'b', a: 1, b: 2 }),
      stringEnumLiteral: new Collection({ a: 'a', b: 'b' }),
      mixedEnumLiteral: new Collection({ '2': 'b', a: 'a', b: 2 }),
      defaultEnumLiteral: new Collection({
        '0': 'a',
        '1': 'b',
        '2': 'c',
        a: 0,
        b: 1,
        c: 2,
      }),
      stringTuple: new Tuple(new InstanceOf(String)),
      numberTuple: new Tuple(new InstanceOf(Number)),
      nullTuple: new Tuple(null),
      undefinedTuple: new Tuple(undefined),
      stringNumberTuple: new Tuple(
        new InstanceOf(String),
        new InstanceOf(Number)
      ),
      mixedTuple: new Tuple(
        new InstanceOf(String),
        new InstanceOf(Number),
        null,
        undefined,
        new Never()
      ),
      optionalMixedTuple: new Optional(
        new Tuple(
          new InstanceOf(String),
          new InstanceOf(Number),
          null,
          undefined,
          new Never()
        )
      ),
      optionalMixedNestedTuple: new Optional(
        new Tuple(
          new InstanceOf(String),
          new InstanceOf(Number),
          null,
          undefined,
          new Never(),
          new Tuple(
            new InstanceOf(String),
            new InstanceOf(Number),
            null,
            undefined,
            new Never()
          )
        )
      ),
      objectRecord: new Collection({}),
      objectLiteral: new Collection({
        name: new InstanceOf(String),
        age: new InstanceOf(Number),
      }),
      objectLiteralEmpty: new Collection({}),
      objectType: new Collection({
        '69': new InstanceOf(Number),
        key: new InstanceOf(String),
      }),
      objectTypeWithSymbol: new Collection({
        '69': new InstanceOf(Number),
        key: new InstanceOf(String),
        [symbolAsAKey]: new InstanceOf(String),
      }),
      objectNested: new Collection({
        first: {
          second: {
            'third-tuple': [new InstanceOf(String), new InstanceOf(Number)],
          },
          'second-key': new InstanceOf(Number),
        },
        'first-key': new InstanceOf(String),
      }),
      class: new InstanceOf(MyClass),
      interface: new Interface({
        field: new InstanceOf(String),
        otherField: new InstanceOf(Number),
      }),
      array: new List(new Any()),
      arrayWithNumber: new List(new InstanceOf(Number)),
      arrayWithLiteralString: new List(new Equals('a')),
      arrayWithLiteralNumber: new List(new Equals(69)),
      arrayWithStrings: new List(new InstanceOf(String)),
      simpleGeneric: new Optional(new InstanceOf(String)),
      regexp: new InstanceOf(RegExp),
      integer: Integer,
      object: new Unrecognized(),
      [symbolAsAKey]: new InstanceOf(String),
    };

    it('returns converted type', () => {
      const classType = converter.convert(MyType);
      const { properties } = classType;
      expect(classType).to.be.instanceof(Class);
      expect(classType.type).to.be.equal(MyType);

      for (const [key, value] of Object.entries(properties)) {
        expect(
          expectedProps[key as any],
          `Expected ${key} to match properties`
        ).to.be.eql(value);
      }
    });

    it(`returns converted type properties by use of '$PropsOf'`, () => {
      const properties = converter.convert(reflect<$PropsOf<MyType>>());

      for (const [key, value] of Object.entries(properties)) {
        expect(
          expectedProps[key as any],
          `Expected ${key} to match properties`
        ).to.be.eql(value);
      }
    });
  });
});
