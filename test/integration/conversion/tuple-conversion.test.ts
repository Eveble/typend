import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { converter } from './setup';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Tuple } from '../../../src/patterns/tuple';
import { Equals } from '../../../src/patterns/equals';
import { Any } from '../../../src/patterns/any';
import { Void } from '../../../src/patterns/void';
import { Never } from '../../../src/patterns/never';
import { Collection } from '../../../src/patterns/collection';
import { Type } from '../../../src/decorators/type.decorator';

describe(`Tuple conversion`, function () {
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

  @Type()
  class MyClass {
    first: string;
  }

  @Type()
  class MyOtherClass {
    second: number;
  }

  describe('reflection', () => {
    it('returns reflected primitive types list', () => {
      const types: [string, any, any][] = [
        ['[null]', reflect<[null]>(), [null]],
        ['[undefined]', reflect<[undefined]>(), [undefined]],
        ['[string]', reflect<[string]>(), [String]],
        ['[number]', reflect<[number]>(), [Number]],
        ['[boolean]', reflect<[boolean]>(), [Boolean]],
        ['[symbol]', reflect<[symbol]>(), [Symbol]],
        [
          '[null, undefined, string, number, boolean, symbol,]',
          reflect<[null, undefined, string, number, boolean, symbol]>(),
          [null, undefined, String, Number, Boolean, Symbol],
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('returns reflected literal types list', () => {
      const types: [string, any, any][] = [
        [`['my-string']`, reflect<['my-string']>(), ['my-string']],
        ['[69]', reflect<[69]>(), [69]],
        ['[true]', reflect<[true]>(), [true]],
        ['[false]', reflect<[false]>(), [false]],
        [
          `['my-string', 69, true, false]`,
          reflect<['my-string', 69, true, false]>(),
          ['my-string', 69, true, false],
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('returns reflected native types list', () => {
      const types: [string, any, any][] = [
        ['[any]', reflect<[any]>(), [new Any()]],
        ['[void]', reflect<[void]>(), [new Void()]],
        ['[never]', reflect<[never]>(), [new Never()]],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('returns reflected types list', () => {
      const types: [string, any, any][] = [
        [
          '[MyType, MyOtherType]',
          reflect<[MyType, MyOtherType]>(),
          [
            {
              first: String,
            },
            {
              second: Number,
            },
          ],
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('returns reflected interfaces list', () => {
      const types: [string, any, any][] = [
        [
          '[MyInterface, MyOtherInterface]',
          reflect<[MyInterface, MyOtherInterface]>(),
          [
            {
              first: String,
            },
            {
              second: Number,
            },
          ],
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('returns reflected classes list', () => {
      const types: [string, any, any][] = [
        [
          '[MyClass, MyOtherClass]',
          reflect<[MyClass, MyOtherClass]>(),
          [MyClass, MyOtherClass],
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });
  });

  describe('conversion', () => {
    it('returns converted primitive types list', () => {
      const types: [string, any, Tuple][] = [
        ['[null]', reflect<[null]>(), new Tuple(null)],
        ['[undefined]', reflect<[undefined]>(), new Tuple(undefined)],
        ['[string]', reflect<[string]>(), new Tuple(new InstanceOf(String))],
        ['[number]', reflect<[number]>(), new Tuple(new InstanceOf(Number))],
        ['[boolean]', reflect<[boolean]>(), new Tuple(new InstanceOf(Boolean))],
        // eslint-disable-next-line no-new-symbol
        ['[symbol]', reflect<[symbol]>(), new Tuple(new InstanceOf(Symbol))],
        [
          '[null, undefined, string, number, boolean, symbol,]',
          reflect<[null, undefined, string, number, boolean, symbol]>(),
          new Tuple(
            null,
            undefined,
            new InstanceOf(String),
            new InstanceOf(Number),
            new InstanceOf(Boolean),
            // eslint-disable-next-line no-new-symbol
            new InstanceOf(Symbol)
          ),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('returns converted literal types list', () => {
      const types: [string, any, Tuple][] = [
        [
          `['my-string']`,
          reflect<['my-string']>(),
          new Tuple(new Equals('my-string')),
        ],
        ['[69]', reflect<[69]>(), new Tuple(new Equals(69))],
        ['[true]', reflect<[true]>(), new Tuple(new Equals(true))],
        ['[false]', reflect<[false]>(), new Tuple(new Equals(false))],
        [
          `['my-string', 69, true, false]`,
          reflect<['my-string', 69, true, false]>(),
          new Tuple(
            new Equals('my-string'),
            new Equals(69),
            new Equals(true),
            new Equals(false)
          ),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('returns converted native types list', () => {
      const types: [string, any, Tuple][] = [
        ['[any]', reflect<[any]>(), new Tuple(new Any())],
        ['[void]', reflect<[void]>(), new Tuple(new Void())],
        ['[never]', reflect<[never]>(), new Tuple(new Never())],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('returns converted types list', () => {
      const types: [string, any, Tuple][] = [
        [
          '[MyType, MyOtherType]',
          reflect<[MyType, MyOtherType]>(),
          new Tuple(
            new Collection({
              first: new InstanceOf(String),
            }),
            new Collection({
              second: new InstanceOf(Number),
            })
          ),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('returns converted interfaces list', () => {
      const types: [string, any, Tuple][] = [
        [
          '[MyInterface, MyOtherInterface]',
          reflect<[MyInterface, MyOtherInterface]>(),
          new Tuple(
            new Collection({
              first: new InstanceOf(String),
            }),
            new Collection({
              second: new InstanceOf(Number),
            })
          ),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('returns converted classes list', () => {
      const types: [string, any, Tuple][] = [
        [
          '[MyClass, MyOtherClass]',
          reflect<[MyClass, MyOtherClass]>(),
          new Tuple(new InstanceOf(MyClass), new InstanceOf(MyOtherClass)),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });
  });
});
