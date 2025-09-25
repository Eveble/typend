import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { converter } from './setup';
import { Collection } from '../../../src/patterns/collection';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Equals } from '../../../src/patterns/equals';
import { Any } from '../../../src/patterns/any';
import { Void } from '../../../src/patterns/void';
import { Never } from '../../../src/patterns/never';
import { Unknown } from '../../../src/patterns/unknown';
import { Optional } from '../../../src/patterns/optional';
import { OneOf } from '../../../src/patterns/one-of';
import { Tuple } from '../../../src/patterns/tuple';
import { Interface } from '../../../src/patterns/interface';
import { Type } from '../../../src/decorators/type.decorator';

describe(`Object conversion`, () => {
  @Type()
  class MyClass {
    key: string;
  }

  const symbolAsAKey = Symbol('some key');

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

  describe('conversion', () => {
    it.skip('ensures that Record types definition is enforced upon key and value', () => {
      throw new Error('not implemented');
    });

    it('returns converted empty object literal with key and values', () => {
      expect(
        converter.convert(reflect<{ key: 'value' }>()),
        `Expected { key: 'value' } to match converted definition`
      ).to.be.eql(new Collection({ key: new Equals('value') }));
    });

    it('returns converted object literal with symbol key and values', () => {
      expect(
        converter.convert(reflect<{ [symbolAsAKey]: string }>()),
        `Expected { [symbolAsAKey]: string } to match converted definition`
      ).to.be.eql(new Collection({ [symbolAsAKey]: new InstanceOf(String) }));
    });

    it('returns converted object literal with nested object', () => {
      expect(
        converter.convert(reflect<{ first: { second: string } }>()),
        `Expected {first: {second: string}} to match converted definition`
      ).to.be.eql(
        new Collection({
          first: new Collection({ second: new InstanceOf(String) }),
        })
      );
    });

    it('returns converted object literal with native type properties', () => {
      type NativeObject = {
        any: any;

        void: void;

        never: never;

        unknown: unknown;
      };

      expect(converter.convert(reflect<NativeObject>())).to.be.eql(
        new Collection({
          any: new Any(),

          void: new Void(),

          never: new Never(),

          unknown: new Unknown(),
        })
      );
    });

    it('returns converted object literal with primitive types properties', () => {
      type PrimitiveObject = {
        null: null;

        undefined: undefined;

        string: string;

        number: number;

        symbol: symbol;

        boolean: boolean;
      };

      expect(converter.convert(reflect<PrimitiveObject>())).to.be.eql(
        new Collection({
          null: null,

          undefined,

          string: new InstanceOf(String),

          number: new InstanceOf(Number),

          symbol: new InstanceOf(Symbol),

          boolean: new InstanceOf(Boolean),
        })
      );
    });

    it('returns converted object literal with literal primitive types properties', () => {
      type ValueLiteralObject = {
        stringLiteral: 'my-string';

        numberLiteral: 5;

        true: true;

        false: false;
      };

      expect(converter.convert(reflect<ValueLiteralObject>())).to.be.eql(
        new Collection({
          stringLiteral: new Equals('my-string'),

          numberLiteral: new Equals(5),

          true: new Equals(true),

          false: new Equals(false),
        })
      );
    });

    it('returns converted object literal with union types properties', () => {
      type UnionObject = {
        optionalString?: string;

        undefinedOrString: undefined | string;

        nullableOrString: null | string;

        numberEnumLiteral: NumberEnum;

        stringEnumLiteral: StringEnum;

        mixedEnumLiteral: MixedEnum;

        defaultEnumLiteral: DefaultEnum;
      };

      expect(converter.convert(reflect<UnionObject>())).to.be.eql(
        new Collection({
          optionalString: new Optional(new InstanceOf(String)),

          undefinedOrString: new Optional(new InstanceOf(String)),

          nullableOrString: new OneOf(null, new InstanceOf(String)),

          stringEnumLiteral: new OneOf(new Equals('a'), new Equals('b')),

          numberEnumLiteral: new OneOf(new Equals(1), new Equals(2)),

          mixedEnumLiteral: new OneOf(new Equals('a'), new Equals(2)),

          defaultEnumLiteral: new OneOf(
            new Equals(0),
            new Equals(1),
            new Equals(2)
          ),
        })
      );
    });

    it('returns converted object literal with tuple types properties', () => {
      type TupleObject = {
        stringTuple: [string];

        numberTuple: [number];

        nullTuple: [null];

        undefinedTuple: [undefined];

        stringNumberTuple: [string, number];

        mixedTuple: [string, number, null, undefined, never];

        optionalMixedTuple?: [string, number];

        optionalMixedNestedTuple?: [string, number, [false, true]];
      };

      expect(converter.convert(reflect<TupleObject>())).to.be.eql(
        new Collection({
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
            new Tuple(new InstanceOf(String), new InstanceOf(Number))
          ),

          optionalMixedNestedTuple: new Optional(
            new Tuple(
              new InstanceOf(String),
              new InstanceOf(Number),
              new Tuple(new Equals(false), new Equals(true))
            )
          ),
        })
      );
    });

    it('returns converted object literal with nested object', () => {
      type ObjectTypeWithSymbol = {
        key: string;
        69: number;
        [symbolAsAKey]: string; // Symbols are not iterable(!), thats why were using Reflect.ownKeys on TSRuntimeConverter.prototype.decodeProps
      };

      type NestedObject = {
        objectTypeWithSymbol: ObjectTypeWithSymbol;
      };

      expect(converter.convert(reflect<NestedObject>())).to.be.eql(
        new Collection({
          objectTypeWithSymbol: new Collection({
            key: new InstanceOf(String),
            69: new InstanceOf(Number),
            [symbolAsAKey]: new InstanceOf(String),
          }),
        })
      );
    });

    it('returns converted object literal with class property', () => {
      type ClassObject = {
        class: MyClass;
      };

      expect(converter.convert(reflect<ClassObject>())).to.be.eql(
        new Collection({
          class: new InstanceOf(MyClass),
        })
      );
    });

    it('returns converted object literal with type property', () => {
      type MyType = {
        first: string;
        second: number;
      };

      type TypeObject = {
        type: MyType;
      };

      expect(converter.convert(reflect<TypeObject>())).to.be.eql(
        new Collection({
          type: new Collection({
            first: new InstanceOf(String),
            second: new InstanceOf(Number),
          }),
        })
      );
    });

    it('returns converted object literal with interface property', () => {
      interface MyInterface {
        first: string;
        second: number;
      }

      type InterfaceObject = {
        interface: MyInterface;
      };

      expect(converter.convert(reflect<InterfaceObject>())).to.be.eql(
        new Collection({
          interface: new Interface({
            first: new InstanceOf(String),
            second: new InstanceOf(Number),
          }),
        })
      );
    });

    it('returns converted interface as Interface instance', () => {
      interface MyInterface {
        first: string;
        second: number;
      }

      expect(converter.convert(reflect<MyInterface>())).to.be.eql(
        new Interface({
          first: new InstanceOf(String),
          second: new InstanceOf(Number),
        })
      );
    });

    it('returns converted Record as empty Collection instance', () => {
      expect(converter.convert(reflect<Record<keyof any, any>>())).to.be.eql(
        new Collection()
      );
    });

    it('returns converted Record as a type as empty Collection instance', () => {
      type RecordAsAType = Record<keyof any, any>;

      expect(converter.convert(reflect<RecordAsAType>())).to.be.eql(
        new Collection()
      );
    });

    it('returns converted object literal as a type as Collection instance', () => {
      type NamedObjectLiteralAsType = {
        key: string;
      };

      expect(
        converter.convert(reflect<{ obj: NamedObjectLiteralAsType }>())
      ).to.be.eql(
        new Collection({
          obj: new Collection({ key: new InstanceOf(String) }),
        })
      );
    });
  });
});
