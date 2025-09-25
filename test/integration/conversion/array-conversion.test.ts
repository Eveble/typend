import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { converter } from './setup';
import { List } from '../../../src/patterns/list';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Equals } from '../../../src/patterns/equals';
import { Any } from '../../../src/patterns/any';
import { Collection } from '../../../src/patterns/collection';
import { Type } from '../../../src/decorators/type.decorator';

describe(`Array conversion`, () => {
  @Type()
  class MyClass {
    key: string;
  }

  describe('reflection', () => {
    it('reflects Array with generic type declaration', () => {
      const types: [string, any, any[]][] = [
        ['Array<any>', reflect<Array<any>>(), [new Any()]],
        ['Array<string>', reflect<Array<string>>(), [String]],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('reflects Array with native types', () => {
      const types: [string, any, any[]][] = [
        ['any[]', reflect<any[]>(), [new Any()]],
        ['boolean[]', reflect<boolean[]>(), [Boolean]],
        ['null[]', reflect<null[]>(), [null]],
        ['undefined[]', reflect<undefined[]>(), [undefined]],
        ['string[]', reflect<string[]>(), [String]],
        ['number[]', reflect<number[]>(), [Number]],
        ['Function[]', reflect<Function[]>(), [Function]],
        ['Record<any, any>[]', reflect<Record<any, any>[]>(), [{}]],
        ['Map<any, any>[]', reflect<Map<any, any>[]>(), [Map]],
        ['symbol[]', reflect<symbol[]>(), [Symbol]],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.reflect(type),
          `Expected ${desc} to match reflected definition`
        ).to.be.eql(result);
      }
    });

    it('reflects Array with class type', () => {
      expect(converter.reflect(reflect<MyClass[]>()), 'MyClass[]').to.be.eql([
        MyClass,
      ]);
    });

    it('reflects Array with literal values', () => {
      const types: [string, any, any[]][] = [
        [`true[]`, reflect<true[]>(), [true]],
        [`false[]`, reflect<false[]>(), [false]],
        [`'my-string'[]`, reflect<'my-string'[]>(), ['my-string']],
        [`69[]`, reflect<69[]>(), [69]],
        [`{}[]`, reflect<{}[]>(), [{}]],
        [
          `{key: 'my-string';}[]`,
          reflect<{ key: 'my-string' }[]>(),
          [
            {
              key: 'my-string',
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

    it('reflects Array with nested array', () => {
      expect(
        converter.reflect(reflect<string[][]>()),
        `Expected string[][] to match reflected definition`
      ).to.be.eql([[String]]);
    });
  });

  describe('conversion', () => {
    it('converts Array with generic type declaration', () => {
      const types: [string, any, List][] = [
        ['Array<any>', reflect<Array<any>>(), new List(new Any())],
        [
          'Array<string>',
          reflect<Array<string>>(),
          new List(new InstanceOf(String)),
        ],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('converts Array with native types', () => {
      const types: [string, any, List][] = [
        ['any[]', reflect<any[]>(), new List(new Any())],
        ['boolean[]', reflect<boolean[]>(), new List(new InstanceOf(Boolean))],
        ['null[]', reflect<null[]>(), new List(null)],
        ['undefined[]', reflect<undefined[]>(), new List(undefined)],
        ['string[]', reflect<string[]>(), new List(new InstanceOf(String))],
        ['number[]', reflect<number[]>(), new List(new InstanceOf(Number))],
        [
          'Function[]',
          reflect<Function[]>(),
          new List(new InstanceOf(Function)),
        ],
        [
          'Record<any, any>[]',
          reflect<Record<any, any>[]>(),
          new List(new Collection({})),
        ],
        [
          'Map<any, any>[]',
          reflect<Map<any, any>[]>(),
          new List(new InstanceOf(Map)),
        ],
        ['symbol[]', reflect<symbol[]>(), new List(new InstanceOf(Symbol))],
      ];
      for (const [desc, type, result] of types) {
        expect(
          converter.convert(type),
          `Expected ${desc} to match converted definition`
        ).to.be.eql(result);
      }
    });

    it('converts Array with class type', () => {
      expect(converter.convert(reflect<MyClass[]>()), 'MyClass[]').to.be.eql(
        new List(new InstanceOf(MyClass))
      );
    });

    it('converts Array with literal values', () => {
      const types: [string, any, List][] = [
        [`true[]`, reflect<true[]>(), new List(new Equals(true))],
        [`false[]`, reflect<false[]>(), new List(new Equals(false))],
        [
          `'my-string'[]`,
          reflect<'my-string'[]>(),
          new List(new Equals('my-string')),
        ],
        [`69[]`, reflect<69[]>(), new List(new Equals(69))],
        [`{}[]`, reflect<{}[]>(), new List(new Collection({}))],
        [
          `{key: 'my-string';}[]`,
          reflect<{ key: 'my-string' }[]>(),
          new List(
            new Collection({
              key: new Equals('my-string'),
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

    it('converts Array with nested array', () => {
      expect(
        converter.convert(reflect<string[][]>()),
        `Expected string[][] to match converted definition`
      ).to.be.eql(new List(new List(new InstanceOf(String))));
    });
  });
});
