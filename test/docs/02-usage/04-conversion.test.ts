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
  any,
  voided,
  never,
  convert,
  Interface,
  PropTypes,
} from '../../../src';

describe('03-reflection', () => {
  it('interface', () => {
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

    expect(convert<'foo'>()).toEqual(PropTypes.equal('foo'));
  });

  it('constructors', () => {
    expect(convert<any>()).toEqual(any);
    expect(convert<string>()).toEqual(PropTypes.instanceOf(String));
    expect(convert<number>()).toEqual(PropTypes.instanceOf(Number));
    expect(convert<boolean>()).toEqual(PropTypes.instanceOf(Boolean));
    expect(convert<null>()).toBe(null);
    expect(convert<undefined>()).toBe(undefined);
    expect(convert<void>()).toEqual(voided);
    expect(convert<never>()).toEqual(never);
    expect(convert<Record<any, any>>()).toEqual(PropTypes.object);
    expect(convert<string[]>()).toEqual(
      PropTypes.arrayOf(PropTypes.instanceOf(String))
    );
    expect(convert<[string, number]>()).toEqual(
      PropTypes.tuple(
        PropTypes.instanceOf(String),
        PropTypes.instanceOf(Number)
      )
    );
    expect(convert<Date>()).toEqual(PropTypes.instanceOf(Date));
  });

  it('literals', () => {
    expect(convert<'foo'>()).toEqual(PropTypes.equal('foo'));
    expect(convert<'foo' | 'bar'>()).toEqual(
      PropTypes.oneOf([PropTypes.equal('foo'), PropTypes.equal('bar')])
    );
    expect(convert<1337>()).toEqual(PropTypes.equal(1337));
    expect(convert<true>()).toEqual(PropTypes.equal(true));
    expect(convert<false>()).toEqual(PropTypes.equal(false));
    expect(convert<{ key: string }>()).toEqual(
      PropTypes.shape({ key: PropTypes.instanceOf(String) })
    );
    expect(convert<['foo', 1337]>()).toEqual(
      PropTypes.tuple(PropTypes.equal('foo'), PropTypes.equal(1337))
    );
  });
});
