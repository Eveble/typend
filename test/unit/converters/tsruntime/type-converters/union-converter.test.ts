import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { UnionConverter } from '../../../../../src/converters/tsruntime/type-converters/union-converter';
import { define } from '../../../../../src/decorators/define';
import { types } from '../../../../../src/types';
import { OneOf } from '../../../../../src/patterns/one-of';
import { Optional } from '../../../../../src/patterns/optional';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

describe(`UnionConverter`, function () {
  let converter: any;
  let typeConverter: UnionConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    typeConverter = new UnionConverter();
  });

  type MyType = {
    first: string;
  };

  type MyOtherType = {
    second: number;
  };

  interface MyInterface {
    first: string;
  }

  interface MyOtherInterface {
    second: number;
  }

  @define()
  class MyClass {
    first: string;
  }

  @define()
  class MyOtherClass {
    second: number;
  }

  enum StringEnum {
    a = 'a',
    b = 'b',
  }

  enum NumberEnum {
    a = 1,
    b,
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

  describe('evaluation', () => {
    it('returns true for primitive types choices', () => {
      const examples: [string, any][] = [
        ['null | undefined', reflect<null | undefined>()],
        ['string | number | boolean', reflect<string | number | boolean>()],
        [
          'undefined | string | symbol | true',
          reflect<undefined | string | symbol | true>(),
        ],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for primitive literal values choices', () => {
      const examples: [string, any][] = [
        [`'my-string' | undefined`, reflect<'my-string' | undefined>()],
        [`69 | undefined`, reflect<69 | undefined>()],
        [
          `'my-string' | 'my-other-string'`,
          reflect<'my-string' | 'my-other-string'>(),
        ],
        [`1 | 2 | 3 | 4`, reflect<1 | 2 | 3 | 4>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for arrays choices', () => {
      expect(
        typeConverter.isConvertible(reflect<string[] | number[]>()),
        `Expected string[] | number[] to be convertible`
      ).to.be.true;
    });

    it('returns true for objects as a types choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyType | MyOtherType>()),
        `Expected MyType | MyOtherType to be convertible`
      ).to.be.true;
    });

    it('returns true for objects as a interfaces choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyInterface | MyOtherInterface>()),
        `Expected MyInterface | MyOtherInterface to be convertible`
      ).to.be.true;
    });

    it('returns true for classes choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyClass | MyOtherClass>()),
        `Expected MyClass | MyOtherClass to be convertible`
      ).to.be.true;
    });

    it('returns true for enum choices', () => {
      const examples: [string, any][] = [
        [`StringEnum`, reflect<StringEnum>()],
        [`NumberEnum`, reflect<NumberEnum>()],
        [`MixedEnum`, reflect<MixedEnum>()],
        [`DefaultEnum`, reflect<DefaultEnum>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });
  });

  describe('reflection', () => {
    context('one of', () => {
      it('reflects one of type(two or more types) as an array', () => {
        converter.reflect.withArgs({ kind: 2 }).returns(String);
        converter.reflect.withArgs({ kind: 3 }).returns(Number);
        converter.reflect.withArgs({ kind: 4 }).returns(Boolean);
        expect(
          typeConverter.reflect(reflect<string | number | boolean>(), converter)
        ).to.be.eql([Boolean, Number, String]);
      });

      it('converts one of class types as instance of OneOf pattern', () => {
        const classConverter = stubInterface<types.TypeConverter>();
        converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyClass, arguments: [] })
          .returns(true);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyOtherClass, arguments: [] })
          .returns(true);
        expect(
          typeConverter.reflect(reflect<MyClass | MyOtherClass>(), converter)
        ).to.be.eql([MyClass, MyOtherClass]);
      });
    });
    context('optional', () => {
      it('reflects optional type(type|undefined) as array', () => {
        converter.reflect.withArgs({ kind: 8 }).returns(true);
        converter.reflect.withArgs({ kind: 12 }).returns(undefined);
        expect(
          typeConverter.reflect(reflect<true | undefined>(), converter)
        ).to.be.eql([true, undefined]);
      });

      it('reflects optional class type(class|undefined) as array', () => {
        const classConverter = stubInterface<types.TypeConverter>();
        converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyClass, arguments: [] })
          .returns(true);

        converter.reflect.withArgs({ kind: 12 }).returns(undefined);
        expect(
          typeConverter.reflect(reflect<MyClass | undefined>(), converter)
        ).to.be.eql([MyClass, undefined]);
      });
    });
  });

  describe('conversion', () => {
    context('one of', () => {
      it('converts one of type(two or more types) as instance of OneOf pattern', () => {
        converter.convert.withArgs({ kind: 2 }).returns(String);
        converter.convert.withArgs({ kind: 3 }).returns(Number);
        converter.convert.withArgs({ kind: 4 }).returns(Boolean);
        const result = typeConverter.convert(
          reflect<string | number | boolean>(),
          converter
        );
        expect(result).to.be.instanceof(OneOf);
        expect(result).to.be.eql([String, Number, Boolean]);
      });

      it('converts one of type(two or more types) as instance of OneOf pattern with property initializer', () => {
        const reflectedType = {
          kind: 17,
          initializer: (): any => 'my-value',
          types: [{ kind: 2 }, { kind: 3 }, { kind: 4 }],
        };

        converter.convert.withArgs({ kind: 2 }).returns(String);
        converter.convert.withArgs({ kind: 3 }).returns(Number);
        converter.convert.withArgs({ kind: 4 }).returns(Boolean);
        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(OneOf);
        expect(result).to.be.eql([String, Number, Boolean]);
        expect(result.hasInitializer()).to.be.true;
        expect(result.getInitializer()).to.be.equal('my-value');
      });

      it('converts one of class types as instance of OneOf pattern', () => {
        const classConverter = stubInterface<types.TypeConverter>();
        converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyClass, arguments: [] })
          .returns(true);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyOtherClass, arguments: [] })
          .returns(true);
        const result = typeConverter.convert(
          reflect<MyClass | MyOtherClass>(),
          converter
        );
        expect(result).to.be.instanceof(OneOf);
        expect(result).to.be.eql([
          new InstanceOf(MyClass),
          new InstanceOf(MyOtherClass),
        ]);
      });
    });
    context('optional', () => {
      it('converts optional type(type|undefined) as instance of Optional pattern', () => {
        converter.convert.withArgs({ kind: 8 }).returns(true);
        converter.convert.withArgs({ kind: 12 }).returns(undefined);
        const result = typeConverter.convert(
          reflect<true | undefined>(),
          converter
        );
        expect(result).to.be.instanceof(Optional);
        expect(result).to.be.eql([true]);
      });

      it('converts optional type(type|undefined) as instance of OneOf pattern with property initializer', () => {
        const reflectedType = {
          kind: 17,
          initializer: (): any => true,
          types: [{ kind: 8 }, { kind: 12 }],
        };
        converter.convert.withArgs({ kind: 8 }).returns(true);
        converter.convert.withArgs({ kind: 12 }).returns(undefined);
        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(Optional);
        expect(result).to.be.eql([true]);
        expect(result.hasInitializer()).to.be.true;
        expect(result.getInitializer()).to.be.equal(true);
      });

      it('converts optional class type(class|undefined) as instance of Optional pattern', () => {
        const classConverter = stubInterface<types.TypeConverter>();
        converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
        classConverter.isConvertible
          .withArgs({ kind: 18, type: MyClass, arguments: [] })
          .returns(true);
        converter.convert.withArgs({ kind: 12 }).returns(undefined);

        const result = typeConverter.convert(
          reflect<MyClass | undefined>(),
          converter
        );
        expect(result).to.be.instanceof(Optional);
        expect(result).to.be.eql([new InstanceOf(MyClass)]);
      });
    });
  });
});
