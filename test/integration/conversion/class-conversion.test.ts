import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { reflect } from 'tsruntime';
import { define } from '../../../src/decorators/define';
import { converter } from './setup';
import { Class } from '../../../src/patterns/class';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Unknown } from '../../../src/patterns/unknown';
import { Never } from '../../../src/patterns/never';
import { Void } from '../../../src/patterns/void';
import { Any } from '../../../src/patterns/any';
import { Equals } from '../../../src/patterns/equals';
import { OneOf } from '../../../src/patterns/one-of';
import { Optional } from '../../../src/patterns/optional';
import { Tuple } from '../../../src/patterns/tuple';
import { Collection } from '../../../src/patterns/collection';

chai.use(sinonChai);

describe(`Class conversion`, function () {
  @define()
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

  describe('reflected', () => {
    it('ensures tha class property key as symbol is preserved on class definitions', () => {
      @define()
      class SymbolClass {
        [symbolAsAKey]: string;
      }

      expect(converter.reflect(reflect<SymbolClass>())).to.be.eql({
        [symbolAsAKey]: String,
      });
    });

    it(`ensures tha use of 'Reflect.ownKeys' does not impact on class properties key names matching build-in native ones`, () => {
      @define()
      class EnsureKeysClass {
        length: number;
      }

      expect(converter.reflect(reflect<EnsureKeysClass>())).to.be.eql({
        length: Number,
      });
    });

    it(`returns properties notated as not-null(bang operator)`, () => {
      @define()
      class BangClass {
        key!: string;
      }

      expect(converter.reflect(reflect<BangClass>())).to.be.eql({
        key: String,
      });
    });

    it('returns reflected class with native type properties', () => {
      @define()
      class NativeClass {
        any: any;

        void: void;

        never: never;

        unknown: unknown;
      }

      expect(converter.reflect(reflect<NativeClass>())).to.be.eql({
        any: new Any(),

        void: new Void(),

        never: new Never(),

        unknown: new Unknown(),
      });
    });

    it('returns reflected class with primitive types properties', () => {
      @define()
      class PrimitiveClass {
        null: null;

        undefined: undefined;

        string: string;

        number: number;

        symbol: symbol;

        boolean: boolean;
      }

      expect(converter.reflect(reflect<PrimitiveClass>())).to.be.eql({
        null: null,

        undefined,

        string: String,

        number: Number,

        symbol: Symbol,

        boolean: Boolean,
      });
    });

    it('returns reflected class with literal primitive types properties', () => {
      @define()
      class ValueLiteralClass {
        stringLiteral: 'my-string';

        numberLiteral: 5;

        true: true;

        false: false;
      }

      expect(converter.reflect(reflect<ValueLiteralClass>())).to.be.eql({
        stringLiteral: 'my-string',

        numberLiteral: 5,

        true: true,

        false: false,
      });
    });

    it('returns reflected class with union types properties', () => {
      @define()
      class UnionClass {
        optionalString?: string;

        undefinedOrString: undefined | string;

        nullableOrString: null | string;

        numberEnumLiteral: NumberEnum;

        stringEnumLiteral: StringEnum;

        mixedEnumLiteral: MixedEnum;

        defaultEnumLiteral: DefaultEnum;
      }

      expect(converter.reflect(reflect<UnionClass>())).to.be.eql({
        optionalString: [String, undefined],

        undefinedOrString: [String, undefined],

        nullableOrString: [String, null],

        stringEnumLiteral: ['a', 'b'],

        numberEnumLiteral: [1, 2],

        mixedEnumLiteral: [2, 'a'],

        defaultEnumLiteral: [0, 1, 2],
      });
    });

    it('returns reflected class with tuple types properties', () => {
      @define()
      class TupleClass {
        stringTuple: [string];

        numberTuple: [number];

        nullTuple: [null];

        undefinedTuple: [undefined];

        stringNumberTuple: [string, number];

        mixedTuple: [string, number, null, undefined, never];

        optionalMixedTuple?: [string, number];

        optionalMixedNestedTuple?: [string, number, [false, true]];
      }

      expect(converter.reflect(reflect<TupleClass>())).to.be.eql({
        stringTuple: [String],

        numberTuple: [Number],

        nullTuple: [null],

        undefinedTuple: [undefined],

        stringNumberTuple: [String, Number],

        mixedTuple: [String, Number, null, undefined, new Never()],
        optionalMixedTuple: [[String, Number], undefined],

        optionalMixedNestedTuple: [[String, Number, [false, true]], undefined],
      });
    });

    it('returns reflected class with nested object', () => {
      type ObjectTypeWithSymbol = {
        key: string;
        69: number;
        [symbolAsAKey]: string; // Symbols are not iterable(!), thats why were using Reflect.ownKeys on TSRuntimeConverter.prototype.decodeProps
      };

      @define()
      class NestedClass {
        objectTypeWithSymbol: ObjectTypeWithSymbol;
      }

      expect(converter.reflect(reflect<NestedClass>())).to.be.eql({
        objectTypeWithSymbol: new Collection({
          key: String,
          69: Number,
          [symbolAsAKey]: String,
        }),
      });
    });

    it('returns reflected class with class property', () => {
      @define()
      class NestedClass {
        class: MyClass;
      }

      expect(converter.reflect(reflect<NestedClass>())).to.be.eql({
        class: MyClass,
      });
    });

    it('returns reflected class with type property', () => {
      type MyType = {
        first: string;
        second: number;
      };

      @define()
      class TypeClass {
        type: MyType;
      }

      expect(converter.reflect(reflect<TypeClass>())).to.be.eql({
        type: new Collection({
          first: String,
          second: Number,
        }),
      });
    });

    it('returns reflected class with interface property', () => {
      interface MyInterface {
        first: string;
        second: number;
      }

      @define()
      class InterfaceClass {
        interface: MyInterface;
      }

      expect(converter.reflect(reflect<InterfaceClass>())).to.be.eql({
        interface: new Collection({
          first: String,
          second: Number,
        }),
      });
    });
  });

  describe('conversion', () => {
    it('ensures tha class property key as symbol is preserved on class definitions', () => {
      @define()
      class SymbolClass {
        [symbolAsAKey]: string;
      }

      expect(converter.convert(reflect<SymbolClass>())).to.be.eql(
        new Class(SymbolClass, {
          [symbolAsAKey]: new InstanceOf(String),
        })
      );
    });

    it(`ensures tha use of 'Reflect.ownKeys' does not impact on class properties key names matching build-in native ones`, () => {
      @define()
      class EnsureKeysClass {
        length: number;
      }

      expect(converter.convert(reflect<EnsureKeysClass>())).to.be.eql(
        new Class(EnsureKeysClass, {
          length: new InstanceOf(Number),
        })
      );
    });

    it(`returns properties notated as not-null(bang operator)`, () => {
      @define()
      class BangClass {
        key!: string;
      }

      expect(converter.convert(reflect<BangClass>())).to.be.eql(
        new Class(BangClass, {
          key: new InstanceOf(String),
        })
      );
    });

    it('returns converted class with native type properties', () => {
      @define()
      class NativeClass {
        any: any;

        void: void;

        never: never;

        unknown: unknown;
      }

      expect(converter.convert(reflect<NativeClass>())).to.be.eql(
        new Class(NativeClass, {
          any: new Any(),

          void: new Void(),

          never: new Never(),

          unknown: new Unknown(),
        })
      );
    });

    it('returns converted class with primitive types properties', () => {
      @define()
      class PrimitiveClass {
        null: null;

        undefined: undefined;

        string: string;

        number: number;

        symbol: symbol;

        boolean: boolean;
      }

      expect(converter.convert(reflect<PrimitiveClass>())).to.be.eql(
        new Class(PrimitiveClass, {
          null: null,

          undefined,

          string: new InstanceOf(String),

          number: new InstanceOf(Number),

          // eslint-disable-next-line no-new-symbol
          symbol: new InstanceOf(Symbol),

          boolean: new InstanceOf(Boolean),
        })
      );
    });

    it('returns converted class with literal primitive types properties', () => {
      @define()
      class ValueLiteralClass {
        stringLiteral: 'my-string';

        numberLiteral: 5;

        true: true;

        false: false;
      }

      expect(converter.convert(reflect<ValueLiteralClass>())).to.be.eql(
        new Class(ValueLiteralClass, {
          stringLiteral: new Equals('my-string'),

          numberLiteral: new Equals(5),

          true: new Equals(true),

          false: new Equals(false),
        })
      );
    });

    it('returns converted class with union types properties', () => {
      @define()
      class UnionClass {
        optionalString?: string;

        undefinedOrString: undefined | string;

        nullableOrString: null | string;

        numberEnumLiteral: NumberEnum;

        stringEnumLiteral: StringEnum;

        mixedEnumLiteral: MixedEnum;

        defaultEnumLiteral: DefaultEnum;
      }

      expect(converter.convert(reflect<UnionClass>())).to.be.eql(
        new Class(UnionClass, {
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

    it('returns converted class with tuple types properties', () => {
      @define()
      class TupleClass {
        stringTuple: [string];

        numberTuple: [number];

        nullTuple: [null];

        undefinedTuple: [undefined];

        stringNumberTuple: [string, number];

        mixedTuple: [string, number, null, undefined, never];

        optionalMixedTuple?: [string, number];

        optionalMixedNestedTuple?: [string, number, [false, true]];
      }

      expect(converter.convert(reflect<TupleClass>())).to.be.eql(
        new Class(TupleClass, {
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

    it('returns converted class with nested object', () => {
      type ObjectTypeWithSymbol = {
        key: string;
        69: number;
        [symbolAsAKey]: string; // Symbols are not iterable(!), thats why were using Reflect.ownKeys on TSRuntimeConverter.prototype.decodeProps
      };

      @define()
      class NestedClass {
        objectTypeWithSymbol: ObjectTypeWithSymbol;
      }

      expect(converter.convert(reflect<NestedClass>())).to.be.eql(
        new Class(NestedClass, {
          objectTypeWithSymbol: new Collection({
            key: new InstanceOf(String),
            69: new InstanceOf(Number),
            [symbolAsAKey]: new InstanceOf(String),
          }),
        })
      );
    });

    it('returns converted class with class property', () => {
      @define()
      class NestedClass {
        class: MyClass;
      }

      expect(converter.convert(reflect<NestedClass>())).to.be.eql(
        new Class(NestedClass, {
          class: new InstanceOf(MyClass),
        })
      );
    });

    it('returns converted class with type property', () => {
      type MyType = {
        first: string;
        second: number;
      };

      @define()
      class TypeClass {
        type: MyType;
      }

      expect(converter.convert(reflect<TypeClass>())).to.be.eql(
        new Class(TypeClass, {
          type: new Collection({
            first: new InstanceOf(String),
            second: new InstanceOf(Number),
          }),
        })
      );
    });

    it('returns converted class with interface property', () => {
      interface MyInterface {
        first: string;
        second: number;
      }

      @define()
      class InterfaceClass {
        interface: MyInterface;
      }

      expect(converter.convert(reflect<InterfaceClass>())).to.be.eql(
        new Class(InterfaceClass, {
          interface: new Collection({
            first: new InstanceOf(String),
            second: new InstanceOf(Number),
          }),
        })
      );
    });
  });
});
