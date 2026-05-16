import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  check,
  Type,
  UnequalValueError,
  $PropsOf,
  $TypeOf,
  convert,
  reflect,
  Interface,
  integer,
  PropTypes,
} from '../../src/index';

describe('README.md', () => {
  it('intro', () => {
    // Constructors
    check<any>('anything');
    check<string>('foo');
    check<number>(1337);
    check<boolean>(true);
    check<null>(null);
    check<undefined>(undefined);
    check<void>(undefined);
    check<never>(undefined);
    check<Record<any, any>>({});
    check<string[]>(['foo']);
    check<[string, number]>(['foo', 1337]);
    check<Date>(new Date('December 17, 1995 03:24:00'));
    // Literals
    check<'foo'>('foo');
    check<1337>(1337);
    check<true>(true);
    check<false>(false);
    check<{ key: string }>({ key: 'foo' });
    check<['foo', 1337]>(['foo', 1337]);
  });

  it('interfaces', () => {
    interface Person {
      firstName: string;
      lastName: string;
      height: number;
    }

    check<Person>({
      firstName: 'Jane',
      lastName: 'Don',
      height: 175,
    });
  });

  it('on-construction-validation', () => {
    @Type()
    class Unicorn {
      sentence: 'sparkle';

      constructor(sentence: 'sparkle') {
        check<$PropsOf<Unicorn>>({ sentence });
        this.sentence = sentence;
      }
    }

    expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑' as any)).toThrow(
      UnequalValueError
    );
  });

  it('class-validation', () => {
    @Type()
    class MyClass {
      key: string;

      constructor(key: string) {
        this.key = key;
      }
    }
    const myClass = new MyClass('my-string');

    expect(check<MyClass>(myClass)).toBe(true);
    expect(check<$TypeOf<MyClass>>(myClass)).toBe(true);
  });

  it('custom-types', () => {
    check<integer>(10);
  });

  it('reflection-to-native', () => {
    interface Person {
      firstName: string;
      lastName: string;
      height: number;
      getName(): string;
    }

    const PersonInterface = reflect<Person>();
    expect(PersonInterface).toBeInstanceOf(Object);
    expect(PersonInterface).toEqual({
      firstName: String,
      lastName: String,
      height: Number,
      getName: Function,
    });
  });

  it('reflection-to-prop-types', () => {
    interface Person {
      firstName: string;
      lastName: string;
      height: number;
      getName(): string;
    }

    const PersonInterface = convert<Person>();
    expect(PersonInterface).toBeInstanceOf(Interface);
    expect(PersonInterface).toEqual({
      firstName: PropTypes.instanceOf(String),
      lastName: PropTypes.instanceOf(String),
      height: PropTypes.instanceOf(Number),
      getName: PropTypes.instanceOf(Function),
    });
  });
});
