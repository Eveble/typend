import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { define } from '../../../src/decorators/define';
import { converter } from './setup';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Optional } from '../../../src/patterns/optional';
import { OneOf } from '../../../src/patterns/one-of';
import { Equals } from '../../../src/patterns/equals';
import { Collection } from '../../../src/patterns/collection';
import { List } from '../../../src/patterns/list';

describe(`Union conversion`, function () {
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

  describe('reflection', () => {
    describe('reflection of optional declarations to Optional pattern', () => {
      it('reflection declaration of optional type(type|undefined) to Optional pattern', () => {
        const types: [string, any, any[]][] = [
          ['null | undefined', reflect<null | undefined>(), [null, undefined]],
          [
            'string | undefined',
            reflect<string | undefined>(),
            [String, undefined],
          ],
          [`true | undefined`, reflect<true | undefined>(), [true, undefined]],
          [
            `false | undefined`,
            reflect<false | undefined>(),
            [false, undefined],
          ],
          [
            `'my-string' | undefined`,
            reflect<'my-string' | undefined>(),
            ['my-string', undefined],
          ],
          [`69 | undefined`, reflect<69 | undefined>(), [69, undefined]],
          [
            `MyClass | MyOtherClass`,
            reflect<MyClass | MyOtherClass>(),
            [MyClass, MyOtherClass],
          ],
        ];
        for (const [desc, type, result] of types) {
          expect(
            converter.reflect(type),
            `Expected ${desc} to match converted definition`
          ).to.be.eql(result);
        }
      });

      it('ensures that order of provided types in optional declaration is irreverent', () => {
        expect(
          converter.convert(reflect<undefined | string>()),
          `Expected undefined | string to match converted definition`
        ).to.be.eql(new Optional(new InstanceOf(String)));
      });
    });

    describe('conversion of union(one of) declarations to OneOf pattern', () => {
      it('returns converted primitive types choices ', () => {
        const types: [string, any, OneOf][] = [
          [
            'string | number | boolean',
            reflect<string | number | boolean>(),
            new OneOf(
              new InstanceOf(String),
              new InstanceOf(Number),
              new InstanceOf(Boolean)
            ),
          ],
          [
            'undefined | string | symbol | true',
            reflect<undefined | string | symbol | true>(),
            // [!] Order matter not sure why its returned this way
            new OneOf(
              undefined,
              new InstanceOf(String),
              // eslint-disable-next-line no-new-symbol
              new InstanceOf(Symbol),
              new Equals(true)
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

      it('returns converted literal values choices ', () => {
        const types: [string, any, OneOf][] = [
          [
            `'my-string' | 'my-other-string'`,
            reflect<'my-string' | 'my-other-string'>(),
            new OneOf(new Equals('my-string'), new Equals('my-other-string')),
          ],
          [
            `1 | 2 | 3 | 4`,
            reflect<1 | 2 | 3 | 4>(),
            // Its reflected this way...
            new OneOf(
              new Equals(1),
              new Equals(2),
              new Equals(3),
              new Equals(4)
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

      it('returns converted arrays choices', () => {
        expect(
          converter.convert(reflect<string[] | number[]>()),
          `Expected string[] | number[] to match converted definition`
        ).to.be.eql(
          new OneOf(
            new List(new InstanceOf(String)),
            new List(new InstanceOf(Number))
          )
        );
      });

      it('returns converted type choices', () => {
        expect(
          converter.convert(reflect<MyType | MyOtherType>()),
          `Expected MyType | MyOtherType to match converted definition`
        ).to.be.eql(
          new OneOf(
            new Collection({
              first: new InstanceOf(String),
            }),
            new Collection({
              second: new InstanceOf(Number),
            })
          )
        );
      });

      it('returns converted interface choices', () => {
        expect(
          converter.convert(reflect<MyInterface | MyOtherInterface>()),
          `Expected MyInterface | MyOtherInterface to match converted definition`
        ).to.be.eql(
          new OneOf(
            new Collection({
              first: new InstanceOf(String),
            }),
            new Collection({
              second: new InstanceOf(Number),
            })
          )
        );
      });

      it('returns converted classes choices', () => {
        expect(
          converter.convert(reflect<MyClass | MyOtherClass>()),
          `Expected MyClass | MyOtherClass to match converted definition`
        ).to.be.eql(
          new OneOf(new InstanceOf(MyClass), new InstanceOf(MyOtherClass))
        );
      });

      it('returns converted enum choices ', () => {
        const types: [string, any, OneOf][] = [
          [
            'StringEnum',
            reflect<StringEnum>(),
            new OneOf(new Equals('a'), new Equals('b')),
          ],
          [
            'NumberEnum',
            reflect<NumberEnum>(),
            new OneOf(new Equals(1), new Equals(2)),
          ],
          [
            'MixedEnum',
            reflect<MixedEnum>(),
            new OneOf(new Equals('a'), new Equals(2)),
          ],
          [
            'DefaultEnum',
            reflect<DefaultEnum>(),
            new OneOf(new Equals(0), new Equals(1), new Equals(2)),
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
});
